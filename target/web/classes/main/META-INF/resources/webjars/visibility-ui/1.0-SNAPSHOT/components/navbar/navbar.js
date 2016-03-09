/**
 * Created by qmarcelle on 2/3/2016.
 */
app.controller('NavCtrl',['$scope','$location','$rootScope','user','session', function($scope,$location, $rootScope,user, session){


    $scope.menu = [
      {
        'title': 'Home',
        link: '/main_page'
      },
      {
        'title': 'Risk',
        link: '#'
      },
      {
        'title': 'Visibility',
        link: '#'
      }];

    $scope.isCollapsed = true;


    $scope.$watch($scope.active,function(){
      $scope.isLoggedIn = $rootScope.auth.isLoggedIn;
    });

    $scope.logout = function(){
      $rootScope.auth.logOut();
      $location.path('/login')
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };


  }]);
