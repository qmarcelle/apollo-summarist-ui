'use strict';
app.controller('LoginCtrl',['$scope', '$location', '$http', '$translate','Auth','$log','session','$rootScope', '$state','$stateParams', function($scope, $location, $http, $translate,Auth,$log,session,$rootScope, $state,$stateParams) {

    $scope.user = {};
    $scope.errors = {};

     // $scope.badUsernameOrPassword = session.getInvalid();


      $scope.badUsernameOrPassword = $stateParams.bup;
      $scope.missingError = false;

    $scope.ok = function(){
      //make sure the user has entered both a username and password
      if(!$scope.user.username || !$scope.user.password){
        $scope.missingError = true;
        return;
      }
        Auth.logIn({
          username: $scope.user.username,
          password: $scope.user.password
        });
    };

        //function to switch the language
        $scope.switchLanguage = function() {
            $translate.use($scope.selectItem);
        };

        $scope.languages = ['English', 'German', 'Chinese'];
        $scope.selectItem='English';
        $scope.privacy= 'https://network.elemica.com/static/documents/Privacy-Policy-Services.pdf';


      $scope.closeBadAlert = function(){
        $location.path('/login/');
        console.log("by");
      };


      $scope.closeRequiredAlert = function(){
        $scope.missingError = false;
        console.log("by");
      };


      //checking if anything write in the username or pass
      $scope.checkForEnter = function($event){
        if($event && $event.keyCode === 13){
          $scope.ok();
        }
      };

$scope.state = $state.current;
      $scope.params = $stateParams;
    }]);
