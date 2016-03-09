/**
 * Created by qmarcelle on 2/3/2016.
 */
'use strict';
angular.module('elemica-webapp')



  .factory('user', function($resource){
    // var user =  $resource('/masterdata/api/v1/apollo/ui/currentuser');
    return $resource('/masterdata/api/v1/apollo/ui/currentuser',{},{
      getData: {method: 'GET', isArray: false}
    });


  })


  .service('session', function ($resource, user){

// Instantiate data when service
    // is loaded
    this._user = JSON.parse(localStorage.getItem('user'));
    this._accessToken = JSON.parse(localStorage.getItem('auth_token'));

    this.getUser = function(){


      return  this._user;
    };
//overloaded to allow destroy function to pass in a null
    /*this.setUser = function(user){
     this._user = angular.toJson(user);
     localStorage['user'] = angular.toJson(user);
     return this;
     };*/

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
          console.log("AN ERROR HAS OCCURRED");
          localStorage.setItem('user', null);
        }
      });
      return this;
    };

    this.getAccessToken = function(){
      return this._accessToken;
    };

    this.setAccessToken = function(token){
      this._accessToken = angular.toJson(token);
      localStorage['auth_token'] = angular.toJson(token);
      return this;
    };

    this.destroy = function destroy(){
      this.setUser()
        .setAccessToken(null);
      return this;
    };

  });
