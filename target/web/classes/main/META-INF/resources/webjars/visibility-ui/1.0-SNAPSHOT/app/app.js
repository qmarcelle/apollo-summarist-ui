/**
 * Created by qmarcelle on 2/3/2016.
 */
'use strict';

// Declare app level module which depends on views, and components
 var app = angular.module('apollo-summarist', [
    'apollo-login',
    'ui.router',
    'ngResource',
    'ngSanitize',
    'ngAnimate'
  ])
  //authentication
  .service("authInterceptor", function($q, $location) {
    var service = this;
    service.request = function(config) {
      var access_token = localStorage.auth_token ? localStorage.auth_token.replace(/"/g,'') : null;
      /*remove leading quotes and ending quotes from auth token*/

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
  })


  .config(function($stateProvider, $urlRouterProvider,$locationProvider,$httpProvider) {
    $urlRouterProvider
      .otherwise('/');
    $locationProvider.html5Mode(true);

    $httpProvider.interceptors.push('authInterceptor')

  })


  //app run state
  .run(function($rootScope, $location, $state, $injector, $http, $window){
    //redirect to login if auth token is not valid


    $rootScope.$state = $state;


  });




