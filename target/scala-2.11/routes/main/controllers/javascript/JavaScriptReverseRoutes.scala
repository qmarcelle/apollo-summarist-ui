
// @GENERATOR:play-routes-compiler
// @SOURCE:C:/Users/qmarcelle/Documents/GitHub/elemica projects/apollo-summarist-ui/conf/routes
// @DATE:Fri Mar 11 09:58:12 EST 2016

import play.api.routing.JavaScriptReverseRoute
import play.api.mvc.{ QueryStringBindable, PathBindable, Call, JavascriptLiteral }
import play.core.routing.{ HandlerDef, ReverseRouteContext, queryString, dynamicString }


import _root_.controllers.Assets.Asset
import _root_.play.libs.F

// @LINE:6
package controllers.javascript {
  import ReverseRouteContext.empty

  // @LINE:6
  class ReverseAssets(_prefix: => String) {

    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:6
    def at: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.Assets.at",
      """
        function(path,file) {
        
          if (path == """ + implicitly[JavascriptLiteral[String]].to("/public") + """ && file == """ + implicitly[JavascriptLiteral[String]].to("favicon.ico") + """) {
            return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + "favicon.ico"})
          }
        
          if (path == """ + implicitly[JavascriptLiteral[String]].to("/public/app") + """) {
            return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + "public/app/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("file", file)})
          }
        
          if (path == """ + implicitly[JavascriptLiteral[String]].to("/public/assets/images/") + """) {
            return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + "public/assets/images/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("file", file)})
          }
        
          if (path == """ + implicitly[JavascriptLiteral[String]].to("/public/components/auth/") + """) {
            return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + "components/auth/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("file", file)})
          }
        
          if (path == """ + implicitly[JavascriptLiteral[String]].to("/public/components/navbar/") + """) {
            return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + "components/navbar/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("file", file)})
          }
        
          if (path == """ + implicitly[JavascriptLiteral[String]].to("/public/css") + """) {
            return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + "css/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("file", file)})
          }
        
          if (path == """ + implicitly[JavascriptLiteral[String]].to("/public/bower_components") + """) {
            return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + "bower_components/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("file", file)})
          }
        
          if (path == """ + implicitly[JavascriptLiteral[String]].to("/public/app") + """) {
            return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + "app/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("file", file)})
          }
        
          if (path == """ + implicitly[JavascriptLiteral[String]].to("/public/css") + """) {
            return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + "css/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("file", file)})
          }
        
          if (path == """ + implicitly[JavascriptLiteral[String]].to("/public") + """ && file == """ + implicitly[JavascriptLiteral[String]].to("index.html") + """) {
            return _wA({method:"GET", url:"""" + _prefix + """"})
          }
        
          if (path == """ + implicitly[JavascriptLiteral[String]].to("/public") + """ && file == """ + implicitly[JavascriptLiteral[String]].to("index.html") + """) {
            return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + "index.html"})
          }
        
          if (path == """ + implicitly[JavascriptLiteral[String]].to("/public") + """ && file == """ + implicitly[JavascriptLiteral[String]].to("index.html") + """) {
            return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + "summarist"})
          }
        
          if (path == """ + implicitly[JavascriptLiteral[String]].to("/public") + """ && file == """ + implicitly[JavascriptLiteral[String]].to("index.html") + """) {
            return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + "login"})
          }
        
          if (path == """ + implicitly[JavascriptLiteral[String]].to("/public") + """ && file == """ + implicitly[JavascriptLiteral[String]].to("index.html") + """) {
            return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + "login/"})
          }
        
        }
      """
    )
  
  }

  // @LINE:33
  class ReverseApplication(_prefix: => String) {

    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:33
    def gateway: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.Application.gateway",
      """
        function(url) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("url", url)})
        }
      """
    )
  
    // @LINE:35
    def gatewayPost: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.Application.gatewayPost",
      """
        function(url) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("url", url)})
        }
      """
    )
  
  }


}