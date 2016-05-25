
// @GENERATOR:play-routes-compiler
// @SOURCE:C:/Users/qmarcelle/Documents/GitHub/elemica projects/apollo-summarist-ui/conf/routes
// @DATE:Mon Mar 28 09:05:10 EDT 2016

import play.api.mvc.{ QueryStringBindable, PathBindable, Call, JavascriptLiteral }
import play.core.routing.{ HandlerDef, ReverseRouteContext, queryString, dynamicString }


import _root_.controllers.Assets.Asset
import _root_.play.libs.F

// @LINE:6
package controllers {

  // @LINE:6
  class ReverseAssets(_prefix: => String) {
    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:6
    def at(path:String, file:String): Call = {
    
      (path: @unchecked, file: @unchecked) match {
      
        // @LINE:6
        case (path, file) if path == "/public" && file == "favicon.ico" =>
          implicit val _rrc = new ReverseRouteContext(Map(("path", "/public"), ("file", "favicon.ico")))
          Call("GET", _prefix + { _defaultPrefix } + "favicon.ico")
      
        // @LINE:7
        case (path, file) if path == "/public/app" =>
          implicit val _rrc = new ReverseRouteContext(Map(("path", "/public/app")))
          Call("GET", _prefix + { _defaultPrefix } + "public/app/" + implicitly[PathBindable[String]].unbind("file", file))
      
        // @LINE:9
        case (path, file) if path == "/public/assets/images/" =>
          implicit val _rrc = new ReverseRouteContext(Map(("path", "/public/assets/images/")))
          Call("GET", _prefix + { _defaultPrefix } + "public/assets/images/" + implicitly[PathBindable[String]].unbind("file", file))
      
        // @LINE:11
        case (path, file) if path == "/public/components/auth/" =>
          implicit val _rrc = new ReverseRouteContext(Map(("path", "/public/components/auth/")))
          Call("GET", _prefix + { _defaultPrefix } + "components/auth/" + implicitly[PathBindable[String]].unbind("file", file))
      
        // @LINE:13
        case (path, file) if path == "/public/components/navbar/" =>
          implicit val _rrc = new ReverseRouteContext(Map(("path", "/public/components/navbar/")))
          Call("GET", _prefix + { _defaultPrefix } + "components/navbar/" + implicitly[PathBindable[String]].unbind("file", file))
      
        // @LINE:15
        case (path, file) if path == "/public/bower_components" =>
          implicit val _rrc = new ReverseRouteContext(Map(("path", "/public/bower_components")))
          Call("GET", _prefix + { _defaultPrefix } + "bower_components/" + implicitly[PathBindable[String]].unbind("file", file))
      
        // @LINE:17
        case (path, file) if path == "/public/css" =>
          implicit val _rrc = new ReverseRouteContext(Map(("path", "/public/css")))
          Call("GET", _prefix + { _defaultPrefix } + "css/" + implicitly[PathBindable[String]].unbind("file", file))
      
        // @LINE:21
        case (path, file) if path == "/public" && file == "index.html" =>
          implicit val _rrc = new ReverseRouteContext(Map(("path", "/public"), ("file", "index.html")))
          Call("GET", _prefix)
      
      }
    
    }
  
  }

  // @LINE:31
  class ReverseApplication(_prefix: => String) {
    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:31
    def gateway(url:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("url", url))
    }
  
    // @LINE:33
    def gatewayPost(url:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("url", url))
    }
  
  }


}