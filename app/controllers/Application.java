package controllers;

import com.fasterxml.jackson.databind.JsonNode;
import play.*;
import javax.inject.Inject;
import play.api.libs.json.JsPath;
import play.api.libs.json.Json;
import play.libs.ws.*;
import play.mvc.*;
import play.libs.F.Function;
import play.libs.F.Promise;
import com.fasterxml.jackson.databind.JsonNode;
import views.html.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Arrays;
import java.util.Map;
import java.util.Set;

public class Application extends Controller {

    public Result index() {
        return ok("Gateway is ready.");
    }


    public Promise<Result> gateway(String url) {
        URI uriUrl = null;
        try {
            uriUrl = new URI(url);
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }
        String[] segments = uriUrl.getPath().split("/");
        String service = segments[0];
        final String serviceUrl = Play.application().configuration().getString(service);
        if (serviceUrl == null){
            return Promise.promise(() -> badRequest("Service is not available"));
        }
        final Set<Map.Entry<String,String[]>> entries = request().queryString().entrySet();
        WSClient ws = WS.client();
        Logger.debug("target url :> "+"http://"+serviceUrl+"/" + url);
        WSRequest call = ws.url("http://"+serviceUrl+"/" + url);
        call.setHeader("Content-Type", "application/json");
        if (request().hasHeader("X-AUTH-TOKEN")){
            call.setHeader("X-AUTH-TOKEN", request().getHeader("X-AUTH-TOKEN"));
        }

        try {
            URI uri = new URI(request().uri());
            String qs = uri.getQuery();
            Logger.debug("QS: " + qs);
            if(qs !=null ) {
                call.setQueryString(qs);
            }
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }

         Logger.debug("point 1");
        Logger.debug(url);
        Logger.debug(entries.toString());
        Logger.debug("point 2");
        return call.get().map(response -> ok(response.asJson()));
    }
    public Promise<Result> gatewayPost(String url) {
        URI uriUrl = null;
        try {
            uriUrl = new URI(url);
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }
        String[] segments = uriUrl.getPath().split("/");
        String service = segments[0];
        final String serviceUrl = Play.application().configuration().getString(service);
        if (serviceUrl == null){
            return Promise.promise(() -> badRequest("Service is not available"));
        }

        WSClient ws = WS.client();
        Logger.debug("target url :> "+"http://"+serviceUrl+"/" + url);
        WSRequest call = ws.url("http://"+serviceUrl+"/" + url);

        call.setHeader("Content-Type", "application/json");
        // ensure use correct header

        final JsonNode entries = request().body().asJson();
        if (request().hasHeader("X-AUTH-TOKEN")){
            call.setHeader("X-AUTH-TOKEN", request().getHeader("X-AUTH-TOKEN"));
        }
        if ( entries != null){
             Logger.debug(entries.toString());
            System.out.println(call.post(entries.toString()));
            //System.out.println(entries.toString().asJson());
             return call.post(entries.toString()).map(response -> ok(response.asJson()));
        }else{
            return Promise.promise(() -> badRequest("Expecting Json data"));}



    }

}
