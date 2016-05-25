/**
 * Created by qmarcelle on 11/5/2015.
 */

//Interceptor for store the token into header for all calls
app.service('Auth',['$http', 'session','$state', '$location','$rootScope',function ($http, session,$state, $location,$rootScope){
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
          if(response.data.authToken){//if the user logged in successfully
            var data = response.data;
            session.setAccessToken(data['authToken']);
            //session.setInvalid(false);
            console.log("tried to post to login");
            //set the token variable
            token = session.getAccessToken();
            if ($rootScope.state) {
              $state.go($rootScope.state);
            } else {
              $state.go('summarist');
            }
           // $location.path('/supply_chain')
          }
          ///fix for locked account / bad login logic invalid credentials
          else if (response.data.success === false /*&& typeof response.data !== 'undefined' && typeof response.data.validationErrors == "undefined"*/) {
            $state.go('login',{bup: true})
          }
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

  }])

//auth interceptor
  .service("authInterceptor", function($q, $location) {
    var service = this;
    service.request = function(config) {
      var access_token = localStorage.auth_token ? localStorage.auth_token : null;


      config.headers = config.headers || {};
      if (access_token) {
        config.headers['X-AUTH-TOKEN'] = access_token;
      }
      return config;
    };
    service.response = function(res) {
      //check for errors
      if(res.status === 401){
        //redirect to login
        $location.path('/login');
        //remove any stale tokens
        window.localStorage.removeItem('auth_token');
        return $q.reject(res);
      }
      else if(res.status === 500){
        //redirect to login
        $location.path('/login');
        //remove any stale tokens
        window.localStorage.removeItem('auth_token');
        return $q.reject(res);
      }
      else{
        return res;
      }
    }
  });

