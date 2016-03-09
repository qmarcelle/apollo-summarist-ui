/**
 * Created by qmarcelle on 2/3/2016.
 */
'use strict';

app.config(function($stateProvider){
    $stateProvider
      .state('summarist', {
        url:'/supply_chain',
        templateUrl: 'app/summarist/summarist.html',
        controller: 'SummCtrl',
        authenticate: true
      })
  })
  .controller('SummCtrl',function($scope,$timeout,$log) {


    $scope.messages = {

    };


    $scope.tableParams = new ngTableParams(
      {page:1,count: 10},
      {

      }

    )



  });
