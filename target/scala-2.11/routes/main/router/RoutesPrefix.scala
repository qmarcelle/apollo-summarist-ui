
// @GENERATOR:play-routes-compiler
// @SOURCE:C:/Users/qmarcelle/Documents/GitHub/elemica projects/apollo-summarist-ui/conf/routes
// @DATE:Fri Mar 11 09:58:12 EST 2016


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
