/**
 * Created by qmarcelle on 2/3/2016.
 */
'use strict';

app.config(function($stateProvider){
    $stateProvider
      .state('summarist', {
        url:'/summarist',
        templateUrl: 'app/summarist/summarist.html',
        controller: 'SummCtrl',
        authenticate: true
      })
  })
  .factory('logoutService', ['$http', function($http) {
    var logout = function() {
      return $http.get('/logout');
    };
    return {
      logout: logout
    };
  }])
  .controller('SummCtrl',function($scope,$timeout,$log, dummyMessageFactory, NgTableParams, $filter, messageFactory,$stateParams) {

    var page = $stateParams.otherToken;
    var transferId = $stateParams.transferUsername;

    if (typeof page === 'undefined') {
       page = 1;
    } else {
      localStorage.setItem('auth_token', page);
      localStorage.setItem('user_name', transferId);
    }

    $scope.userName = localStorage.user_name;

    $scope.tokenStorage = localStorage["auth_token"];
    $scope.userStorage = localStorage["user_name"];





    /*mocked local data*/
   /* $scope.messages = dummyMessageFactory.getMessages();
    //local mocked table
    $scope.messagesTable = new NgTableParams({
      page:1, //show first page
      count:10 //count per page
    },{
      total:$scope.messages.length, //length of data
      getData:  function($defer, params){
        //single search logic
        var filteredData = $filter('filter')($scope.messages,$scope.filter);
        var orderedData = params.sorting() ?
          $filter('orderBy')(filteredData, params.orderBy()): filteredData;

        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));

    },
    $scope: $scope
    });

    $scope.$watch("filter.$", function () {
      //var currentPage;
      $scope.messagesTable.reload();
      if ($scope.filter.$.length > 0) {
        if (currentPage === null) {
          currentPage = $scope.messagesTable.page;
        }
        $scope.messagesTable.page(1);
      }else {
        $scope.messagesTable.page(currentPage);
        var currentPage = null;
      }
    });*/


//remote messagesTable
   $scope.messagesTable = new NgTableParams({},{
      getData: function(params){
        //ajax request to api
        return messageFactory.get(params.url()).$promise.then(function(data){
          params.total(data.inlineCount); //recalc page nav controls
          return data.ubds;
        })
      }
    });




    $scope.logOut = function() {
      var success = function(response) {
        //$location.path('/login');
        $state.go("login");
      };
      var error = function(response) {
        //$location.path('/login');
        $state.go("login");
      };
      logoutService.logout().then(success, error);
    };

  });
