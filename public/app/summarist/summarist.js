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
  .controller('SummCtrl',function($scope,$timeout,$log, dummyMessageFactory, NgTableParams, $filter) {

    $scope.messages = dummyMessageFactory.getMessages();



    $scope.$watch("filter.$", function () {
      $scope.messagesTable.reload();
      if ($scope.filter.$.length > 0) {
        if (currentPage === null) {
          currentPage = $scope.tableParams.page;
        }
        $scope.tableParams.page(1);
      }else {
        $scope.tableParams.page(currentPage);
        currentPage = null;
      }
    });



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

  });
