'use strict';
var app = angular.module('apollo-login',['ui.router',
    'ngResource',
    'ngSanitize',
    'ngAnimate',
    'pascalprecht.translate',
    'translationLogin',
    'apollo-login.templates'])


  .config(function($stateProvider, $urlRouterProvider,$locationProvider,$httpProvider) {
    //states
    $stateProvider
      .state('login', {
        url:'/login/:bup',/*bup: boolean flag for bad username or password*/
        templateProvider: function($templateCache){
          return $templateCache.get('views/login.html')
        },
        controller: 'LoginCtrl'
      });
    $urlRouterProvider
      .otherwise('/');
    $locationProvider.html5Mode(true);
    //push auth interceptor for token verification
    $httpProvider.interceptors.push('authInterceptor')

  })


  //app run state
  .run(function($rootScope, $location, Auth, $state, $injector, session, $http, $window, user){
    //redirect to login if auth token is not valid
    $rootScope.auth = Auth;

   // $rootScope.$state = $state;

    if(session.getAccessToken){
      $rootScope.auth_token = session.getAccessToken();
    }

  });
