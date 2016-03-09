/**
 * Created by qmarcelle on 2/3/2016.
 */

//Interceptor for store the token into header for all calls
angular.module('elemica-webapp')

  .service('Auth',function ($http, session){
    /**
     * Check whether the user is logged in
     * @returns boolean
     */
    this.isLoggedIn = function(){
      return session.getAccessToken() !== null;
    };
    var token = null;

    /**
     * Log in
     *
     * @param credentials
     * @returns {*|Promise}
     */
    this.logIn = function(credentials){
      //$resource('/masterdata/login')

      return $http
        .post('/masterdata/login', credentials)
        .then(function(response){
          var data = response.data;
          session.setAccessToken(data.authToken);
          //set the token variable
          token = session.getAccessToken();

        }).then(function(){
          session.setUser();
          //$http.get('/masterdata/api/v1/apollo/ui/currentuser');
        });
    };



    /**
     * Log out
     *
     * @returns {*|Promise}
     */
    this.logOut = function(){
      this.isLoggedIn();
      session.destroy();

    };

  });
