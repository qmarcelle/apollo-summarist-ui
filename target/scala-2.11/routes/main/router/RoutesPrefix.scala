
// @GENERATOR:play-routes-compiler
// @SOURCE:C:/Users/qmarcelle/Documents/GitHub/elemica projects/apollo-summarist-ui/conf/routes
// @DATE:Mon Mar 28 09:05:10 EDT 2016


package router {
  object RoutesPrefix {
    private var _prefix: String = "/"
    def setPrefix(p: String): Unit = {
      _prefix = p
    }
    def prefix: String = _prefix
    val byNamePrefix: Function0[String] = { () => prefix }
  }
}
