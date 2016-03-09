import play.sbt.PlayRunHook
import sbt._

import java.net.InetSocketAddress

object Grunt {
  def apply(base: File): PlayRunHook = {

    object GruntProcess extends PlayRunHook {

      var process: Option[Process] = None

      def osCommand(command: String): String = {
        System.getProperty("os.name").toLowerCase().startsWith("win") match{
          case true => s"cmd.exe /c $command"
          case false => command
        }
      }

      override def beforeStarted(): Unit = {
        Process(osCommand("grunt dist"), base).run
      }

      override def afterStarted(addr: InetSocketAddress): Unit = {
        process = Some(Process(osCommand("grunt watch"), base).run)
      }

      override def afterStopped(): Unit = {
        process.map(p => p.destroy())
        process = None
      }
    }

    GruntProcess
  }
}