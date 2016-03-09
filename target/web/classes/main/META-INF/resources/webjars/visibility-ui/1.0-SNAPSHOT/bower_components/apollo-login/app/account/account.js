'use strict';
var app = angular.module('apollo-login',['ui.router',
    'ngResource',
    'ngSanitize',
    'ngAnimate',
    'pascalprecht.translate',
    'translationLogin',
    'apollo-login.templates'])
    .config( function($stateProvider) {
        $stateProvider
            .state('login', {
                url:'/login/:bup',/*bup: boolean flag for bad username or password*/
               /* templateUrl: '/views/login.html',*/
              templateProvider: function($templateCache){
                return $templateCache.get('views/login.html')
              },
                controller: 'LoginCtrl'
            })
    })



  .config(function($stateProvider, $urlRouterProvider,$locationProvider,$httpProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);

    //angular.extend(DSProvider.defaults, {});
    //angular.extend(DSHttpAdapterProvider.defaults, {});

  })


  //app run state
  .run(function($rootScope, $location, Auth, $state, $injector, session, $http, $window, user){
    //redirect to login if auth token is not valid
    $rootScope.auth = Auth;

    $rootScope.$state = $state;

    if(session.getAccessToken){
      $rootScope.auth_token = session.getAccessToken();
    }

    user.getData(function(data){

      $rootScope.username = data.username;
//if the current user call can be made then return the current user to the main page
      //if there is an error redirect to login
    },function(e){
      $state.go('login');
    });
  });
