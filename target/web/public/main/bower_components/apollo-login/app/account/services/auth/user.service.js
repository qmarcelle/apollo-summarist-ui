/**
 * Created by qmarcelle on 11/5/2015.
 */
'use strict';
app.factory('user', function($resource){
    // var user =  $resource('/masterdata/api/v1/apollo/ui/currentuser');
    return $resource('/masterdata/api/v1/apollo/ui/currentuser',{},{
      getData: {method: 'GET', isArray: false}
    });


  });


app.service('session',['$resource','user', function ($resource, user){

// Instantiate data when service
    // is loaded
    this._user = JSON.parse(localStorage.getItem('user'));
    this._accessToken = localStorage.getItem('auth_token');


    this.getUser = function(){
      return  this._user;
    };

    this.setUser = function(){
      //hold initial null value for username - used for isLoggedIn function
      var username = null;
      //call the user factory
      user.get(function(data){
        //assign the username property of the data returned to the username variable
        username = data.username;
        //set the username property in local storage
        localStorage.setItem('user', angular.toJson(username));
      },function(e){
        if(e.status!==200){
          console.log(e.status);
          localStorage.setItem('user', null);
        }
      });
      return this;
    };

    this.getAccessToken = function(){
      return this._accessToken;
    };

    this.setAccessToken = function(token){
      this._accessToken = token;//angular.toJson(token);
      localStorage.setItem('auth_token',token);

      return this;
    };

    this.destroy = function destroy(){
      this.setUser()
        .setAccessToken(null);
      //log out of remote
      $http.get('/logout');
      return this;
    };

  }]);
