import java.time.format.{DateTimeFormatter, DateTimeFormatterBuilder}
import java.time.{ZonedDateTime, ZoneId}

import Grunt._
import com.typesafe.sbt.packager.MappingsHelper._
import play.PlayImport.PlayKeys.playRunHooks
import com.typesafe.sbt.packager.docker._
playRunHooks <+= baseDirectory.map(base => Grunt(base))
name := """visibility-ui"""

version := "1.0-SNAPSHOT"

//resolvers += "Madoushi sbt-plugins" at "https://dl.bintray.com/madoushi/sbt-plugins/"
//sassOptions in Assets ++= Seq("--compass", "-r", "compass")

maintainer in Docker := "Nathan Blomquist <nathan.blomquist@elemica.com>"
dockerExposedPorts := Seq(9000)
dockerBaseImage := "nathonfowlie/centos-jre:1.8.0_66"

dockerCommands += ExecCmd("RUN",
  "chmod", "+x",
  s"${(defaultLinuxInstallLocation in Docker).value}/bin/${executableScriptName.value}")
dockerCommands += ExecCmd("RUN",
  "chmod", "+x",
  s"${(defaultLinuxInstallLocation in Docker).value}/bin/wrapper.sh")

dockerCommands += Cmd("RUN","java -version")
dockerEntrypoint := Seq("bin/wrapper.sh")

mappings in Universal ++= {
  // include extra bin files we may need such as 'consul'
  directory("bin")
}


// enable Java and large class path usage on Windows.  We have a lot of dependencies, so use a Classpath Jar.
lazy val root = (project in file(".")).enablePlugins(PlayJava,ClasspathJarPlugin)

scalaVersion := "2.11.6"

libraryDependencies ++= Seq(
  javaJdbc,
  cache,
  javaWs
)

// Play provides two styles of routers, one expects its actions to be injected, the
// other, legacy style, accesses its actions statically.
routesGenerator := InjectedRoutesGenerator


//fork in run := true

/**
 * This task creates a zip file for use in AWS Beanstalk.
 * This depends on docker:stage to create the base files, then zips them up.
 * The zip file will be in the target/aws directory with a name like:
 * aws_build_<name>_<version>_yyyy-MM-ddTHH-mm-ss.zip
 */
lazy val packageAWS = taskKey[File]("Create Package for AWS Beanstalk.")
packageAWS <<= packageAWS.dependsOn(stage in config("docker"))
packageAWS := {
  // we are going to place the zip output file in the target directly
  val targetDirectory = (baseDirectory in Compile).value / "target" / "aws"
  // get all the files and subdirectories of the stage task from docker
  val inputs = Path.allSubpaths((stage in config("docker")).value)
  val dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH-mm-ss")
  val now = ZonedDateTime.now(ZoneId.of("UTC")).format(dtf)
  val zipName = Seq("aws_build", name.value, version.value, now).mkString("_")
  val output: File = targetDirectory / (zipName + ".zip")
  IO.zip(inputs, output)
  println("Package is located here: " + "'" + output.toPath + "'")
  output
}
