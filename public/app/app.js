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

  .config(function($stateProvider, $urlRouterProvider,$locationProvider,$httpProvider) {
    $urlRouterProvider
      .otherwise('/');
    $locationProvider.html5Mode(true);



  })


  //app run state
  .run(function($rootScope, $location, $state, $injector, $http, $window, user){
    //redirect to login if auth token is not valid


    $rootScope.state = 'summarist';
    //upon launch of the app determine if user already has appropriate credentials
    user.getData(function(data){
      $rootScope.username = data.username;
    //if the current user call can be made then return the current user to the main page
      $state.go( $rootScope.state);
      //if there is an error redirect to login
    },function(e){
      $state.go('login');
    });



  });




