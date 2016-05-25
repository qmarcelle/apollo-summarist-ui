angular.module('apollo-login',['ui.router','ngResource','ngSanitize','ngAnimate','auth','md.data.table','myApp.version','pascalprecht.translate','translationLogin','apollo-login.templates']);'use strict';
var app = angular.module('apollo-login',['ui.router',
    'ngResource',
    'ngSanitize',
    'ngAnimate',
  'auth',
    'pascalprecht.translate',
    'translationLogin',
    'apollo-login.templates'])


  .config(function($stateProvider, $urlRouterProvider,$locationProvider,$httpProvider) {
    //states
    $stateProvider
      /*.state('login', {
        url:'/login/:bup',/!*bup: boolean flag for bad username or password*!/
        templateProvider: function($templateCache){
          return $templateCache.get('views/login.html')
        },
        controller: 'LoginCtrl'
      })*/


      .state('login', {
        url: '/login',
        templateProvider: function($templateCache){
          return $templateCache.get('views/md-login.html')
        },
        controller: 'loginController'
      })
      .state('lockedLogin', {
        url: '/lockedLogin',
        templateProvider: function($templateCache){
          return $templateCache.get('views/md-lockedLogin.html')
        },
        controller: 'lockedLoginController'
      })


    ;
    $urlRouterProvider
      .otherwise('/');
    $locationProvider.html5Mode(true);
    //push auth interceptor for token verification
    //$httpProvider.interceptors.push('authInterceptor')

  })


  //app run state
  .run(function($rootScope, $location, Auth, $state, $injector, session, $http, $window, user){
    //redirect to login if auth token is not valid
    $rootScope.auth = Auth;

   // $rootScope.$state = $state;

    if(session.getAccessToken){
      $rootScope.auth_token = session.getAccessToken();
    }

  })

.constant('urlConstant', {
  appName: 'MasterDate',
  appVersion: 0.1,
  apiUrl: '/masterdata/api/v1',
  webUrl: 'http://127.0.0.1:9000'
});

/**
 * Created by qmarcelle on 11/13/2015.
 */

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

/*
/!**
 * Created by qmarcelle on 11/13/2015.
 *!/
'use strict';


describe('Testing login ', function() {

  beforeEach(function() {
    module('gatewayApp.loginApp');
    /!*module("translationLogin", ['pascalprecht.translate']);
     module(function($translateProvider) {
     $translateProvider.translations('English', []);
     })*!/
  });


  var loginService, $httpBackend, data;

  beforeEach(inject(function($injector){

    $httpBackend = $injector.get("$httpBackend");
    loginService = $injector.get("loginService");

    /!*spyOn(loginService, login).and.callFake(function() {
     return {
     success: function(callBack) { callBack({things: 'stuff'})}
     };
     });*!/
  }));


  it('login to company page if username and password is correct', function() {
    $httpBackend.expectPOST('/login', {'username':"houni", 'password':'password'})
      .respond('login');
    loginService.login('houni', 'password').then(function(result) {
      data = result.data;
    });

    $httpBackend.flush();
    expect(data).toEqual('login');
  });

  it('should not login because of bad username', function() {
    $httpBackend.expectPOST('/login', {'username': '', 'password': 'password'})
      .respond({'username': ['This Field is required']});
    loginService.login('', 'password').then(function(result) {
      data = result.data;
    });

    $httpBackend.flush();
    expect(data).toEqual({'username':["This Field is required"]});
  });

  afterEach(function() {
    // make sure all requests where handled as expected.
    $httpBackend.verifyNoOutstandingRequest();
    $httpBackend.verifyNoOutstandingExpectation();
  });

});
*/

/**
 * Created by qmarcelle on 3/28/2016.
 */
'use strict';

//angular.module('gatewayApp.loginApp', ['translationLogin', 'auth', 'ui.router'])

  app.controller("loginController", ['$scope','$rootScope', '$window','$state', '$location','$http','$translate','loginService',
    function ($scope, $rootScope, $window, $state, $location, $http, $translate, loginService) {

      $scope.username = '';
      $scope.password = '';
      $scope.missingError = false;
      $scope.badUsernameOrPassword = false;
      $scope.locked = false;

      //function when user pushing login button
      $scope.ok = function() {

        if(!$scope.username || !$scope.password){
          $scope.missingError = true;
          return;
        }
        //function for storing the token and change location if success
        var success = function(response) {
          if (response.status === 200 && response.data && response.data.authToken) {
            localStorage.setItem('auth_token', response.data['authToken']);
            localStorage.setItem('user_name', $scope.username);
            if ($rootScope.state) {
              $state.go($rootScope.state);
            } else {
              $state.go('companies');
            };
            //$location.path('/companies');
          } else if (response.data.reason_code){

            if (response.data.reason_code === 'PASSWORD_EXPIRED') {
              $rootScope.reason_locked = response.data.reason_code;
              $location.path('/lockedLogin');

            } else {
              $scope.locked = true;
            };
          }
          else {

            //$location.path('/lockedLogin');
            $scope.badUsernameOrPassword = true;
            var numberOfFail = response.data.failedAttempts;
            $scope.remainNumber =  5 - numberOfFail;

          }
        };

        //if the response is error, type error massage in view
        var error = function(response) {
          /*            if (response.data.success == false && typeof response.data !== 'undefined' && typeof response.data.validationErrors == "undefines") {
           console.log("something");
           $location.path('/lockedLogin');
           } else {
           $scope.badUsernameOrPassword = true;
           console.log("Bad Password");
           }*/
          //$location.path('/lockedLogin');
          $scope.badUsernameOrPassword = true;
        };

        loginService.login($scope.username, $scope.password)
          .then(success,error);
      };

      $scope.closeRequiredAlert = function(){
        $scope.missingError = false;
      };

      $scope.closeBadAlert = function(){
        $scope.badUsernameOrPassword = false;
      };

      $scope.closeLockAlert = function() {
        $scope.locked = false;
      };

      //checking if anything write in the username or pass
      $scope.checkForEnter = function($event){
        if($event && $event.keyCode === 13){
          $scope.ok();
        }
      };

      //function to switch the language
      $scope.switchLanguage = function() {
        $translate.use($scope.selectItem);
      };

      $scope.languages = ['English', 'German', 'Chinese'];
      $scope.selectItem = 'English';
      $scope.privacy = 'https://network.elemica.com/static/documents/Privacy-Policy-Services.pdf';

    }])


  // controller for blocked login
  .controller('lockedLoginController', ['$scope', '$rootScope','$location', 'loginService', '$http', '$translate',
    function($scope, $rootScope, $location, loginService, $http, $translate) {

      $scope.passError = false;
      //$scope.reason = $rootScope.reason_locked;

      $scope.changePassword = function() {
        var newPass = {
          username: $scope.username,
          oldPassword: $scope.oldPassword,
          newPassword:  $scope.newPassword,
          confirmNewPassword: $scope.confirmNewPassword
        }

        loginService.changePass(newPass).then(function(response) {
          if (response.data.success) {
            $location.path('/login');
          } else {
            $scope.passError = true;
            $scope.errorReason = response.data.validationErrors;
            $scope.violationError = response.data.msg;
            // return;
          }
        });
      };

      $scope.goToLogin = function() {
        $location.path('/login');
      };

      //checking if anything write in the username or pass
      $scope.checkForEnter = function($event){
        if($event && $event.keyCode === 13){
          $scope.ok();
        }
      };

      //close reason Error Alert
      $scope.closeReasonAlert = function() {

        $scope.passError = false;

      };

      //function to switch the language
      $scope.switchLanguage = function() {
        $translate.use($scope.selectItem);
      };
      $scope.languages = ['English', 'German', 'Chinese'];

    }])

  // Service for logging
  .factory('loginService', ['$http','urlConstant', function($http, urlConstant){
    var service ={
      login: function(username, password) {
        return $http.post("masterdata/login", {"username": username, "password": password});
      },
      changePass: function(newPass) {
        return $http.post(urlConstant.apiUrl+'/password/change', newPass);
      }
    };
    return service;
  }]);



/**
 * Created by qmarcelle on 11/5/2015.
 */

//Interceptor for store the token into header for all calls
app.service('Auth',['$http', 'session','$state', '$location','$rootScope',function ($http, session,$state, $location,$rootScope){
    /**
     * Check whether the user is logged in
     * @returns boolean
     */
    this.isLoggedIn = function(){
      return session.getAccessToken() !== null;
    };
    var token = null;

    /**
     * Log in
     *
     * @param credentials
     * @returns {*|Promise}
     */
    this.logIn = function(credentials){
      //$resource('/masterdata/login')

      return $http
        .post('/masterdata/login', credentials)
        .then(function(response){
          if(response.data.authToken){//if the user logged in successfully
            var data = response.data;
            session.setAccessToken(data['authToken']);
            //session.setInvalid(false);
            console.log("tried to post to login");
            //set the token variable
            token = session.getAccessToken();
            if ($rootScope.state) {
              $state.go($rootScope.state);
            } else {
              $state.go('summarist');
            }
           // $location.path('/supply_chain')
          }
          ///fix for locked account / bad login logic invalid credentials
          else if (response.data.success === false /*&& typeof response.data !== 'undefined' && typeof response.data.validationErrors == "undefined"*/) {
            $state.go('login',{bup: true})
          }
        }).then(function(){
          session.setUser();
          //$http.get('/masterdata/api/v1/apollo/ui/currentuser');
        });
    };

    /**
     * Log out
     *
     * @returns {*|Promise}
     */
    this.logOut = function(){
      this.isLoggedIn();
      session.destroy();

    };

  }])

//auth interceptor
  .service("authInterceptor", function($q, $location) {
    var service = this;
    service.request = function(config) {
      var access_token = localStorage.auth_token ? localStorage.auth_token : null;


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
  });


/**
 * Created by qmarcelle on 11/13/2015.
 */

/**
 * Created by qmarcelle on 11/5/2015.
 */
'use strict';
app.factory('user', function($resource){
    // var user =  $resource('/masterdata/api/v1/apollo/ui/currentuser');
    return $resource('/masterdata/api/v1/apollo/ui/currentuser',{},{
      getData: {method: 'GET', isArray: false}
    });


  });


app.service('session',['$resource','user', function ($resource, user){

// Instantiate data when service
    // is loaded
    this._user = JSON.parse(localStorage.getItem('user'));
    this._accessToken = localStorage.getItem('auth_token');


    this.getUser = function(){
      return  this._user;
    };

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
          console.log(e.status);
          localStorage.setItem('user', null);
        }
      });
      return this;
    };

    this.getAccessToken = function(){
      return this._accessToken;
    };

    this.setAccessToken = function(token){
      this._accessToken = token;//angular.toJson(token);
      localStorage.setItem('auth_token',token);

      return this;
    };

    this.destroy = function destroy(){
      this.setUser()
        .setAccessToken(null);
      //log out of remote
      $http.get('/logout');
      return this;
    };

  }]);

/**
 * Created by qmarcelle on 11/13/2015.
 */

angular.module("translationLogin", ['pascalprecht.translate'])
  .config(['$translateProvider', function ($translateProvider) {

    $translateProvider.translations('English', {
        "views.main.Username":'Username',
        "passwordTip": "Password Must contains at least one uppercase, one lowercase, one number, and one special character",
        "views.main.Password": 'Password',
        "directives.language-select.Language":'Language',
        "views.main.cancel": "Cancel",
        "en-option": "English",
        "de-option": "German",
        "ch-option": "Chinese",
        "Login": "LOGIN",
        "User-Enter": "Username",
        "Pass-Enter": "Password",
        "UserPassRequired": "Both Username and Password are required.",
        "BadUser": "Invalid Username or Password!",
        "lang":'Language',
        "title": "SUPPLY CHAIN OPERATING NETWORK",
        "forgotPassword": "Forgot Password!",
        "loginBlock": "Login Block",
        "oldPass": "Current Password",
        "newPass": "New Password",
        "changePass": "change Password",
        "gobackLogin": "Go back to login",
        "PASSWORD_TOO_SHORT": "Password must has atleast 8 character",
        "PASSWORD_INSUFFICIENT_LOWERCASE": "Password must contain at least one lowercase",
        "PASSWORD_INSUFFICIENT_UPPERCASE": "Password must contain at least one uppercase",
        "PASSWORD_INSUFFICIENT_DIGIT": "Password must contain at least one digit",
        "PASSWORD_INSUFFICIENT_SPECIAL": "Password must contain at least one special character",
        "New password failed validation.": "New password failed validation.",
        "Username or Password is wrong.": "Username or Password is wrong.",
        "name": "Name",
        "identifier": 'Identifier',
        "idType": "Identifier Type",
        "childCompany": "Child Company",
        "edit": "Edit",
        "findCompany": "Find Company",
        "addCompany": "ADD COMPANY",
        "parentComp": "Parent Company",
        "saveChange": "Save",
        "editComp": "Edit Company",
        "listChildren": "List Children",
        "reset": "Reset",
        "refresh": "Refresh",
        "policy": 'By clicking Login you accept the Elemica',
        "paccept": "Privacy Policy",
        "finduser": "Find User",
        "adduser": "ADD USER",
        "fname": "First Name",
        "lname": "Last Name",
        "email": "Email",
        "phone": "Phone",
        "llogin": "Last Login",
        "locate": "Location",
        "home": "Home",
        "comps": "Companies",
        "users": "Users",
        "products": "Products",
        "edituser": "Edit User",
        'confirmpass': "Confirm Password",
        'itemPerPage': "Items per page",
        'searchName': 'Search for Name',
        'searchCompany': 'Search for Company',
        'searchId': "Search for ID",
        "searchUser": 'Search for User',
        "compId": "Company",
        'rolename': 'Role Name',
        'companyRole': 'Company Roles',
        'userRoles': 'User Roles',
        'addRole': 'Add Role',
        'noRoles': "There is no role for this company",
        'uRole': 'User Roles',
        'add': 'ADD',
        'deleteRole': 'Delete Role',
        'Upload Product XReference': 'Upload Product XReference',
        'Products XReference File': 'Products XReference File',
        'findproduct': 'Find Product',
        'searchProduct': 'Search for Product',
        'addProduct': 'ADD PRODUCT',
        'description': 'Description',
        'editProduct': 'Edit Product',
        'reference': 'Cross References',
        'productId': 'Product Id',
        'productName': 'Product Name',
        'companyProducts': 'Company Products',
        'bi': 'Bi Directional',
        'uni': 'Uni Directional',
        'addRef': 'Add Cross Reference',
        "UserIdRequired": 'User Info Required',
        'logout': 'Logout'

      })
      .translations('German', {
        "views.main.Username":'Benutzername',
        "views.main.Password": 'Passwort',
        "passwordTip": "Das Passwort muss mindestens einen Großbuchstaben , einen Klein, eine Zahl und ein Sonderzeichen",
        "directives.language-select.Language":'Sprache',
        "views.main.cancel": "stornieren",
        "de-option": "deutsch",
        "en-option": "englisch",
        "ch-option": "Chinesisch",
        "Login": "Einloggen",
        "User-Enter": "Benutzername",
        "Pass-Enter": "Passwort",
        "UserPassRequired": "Sowohl Benutzername und Kennwort erforderlich.",
        "BadUser": "Ungültiger Benutzername oder Passwort!",
        "lang": "Sprache",
        "title": "Supply-Chain-Netzwerkbetriebs",
        "forgotPassword": "Passwort vergessen!",
        "loginBlock": "Login Blocken",
        "oldPass": "Aktuelles Passwort",
        "newPass": "Neues Passwort",
        "changePass": "Passwort ändern",
        "gobackLogin": "Zurück zum Login",
        "PASSWORD_TOO_SHORT": "Passwort ist zu kurz",
        "PASSWORD_INSUFFICIENT_LOWERCASE": "Das Passwort muss mindestens einen Klein enthalten",
        "PASSWORD_INSUFFICIENT_UPPERCASE": "Das Passwort muss mindestens einen Groß enthalten",
        "PASSWORD_INSUFFICIENT_DIGIT": "Das Passwort muss mindestens eine Ziffer enthalten",
        "PASSWORD_INSUFFICIENT_SPECIAL": "Das Passwort muss mindestens ein Sonderzeichen enthalten",
        "New password failed validation.": "Neues Passwort Überprüfung fehlgeschlagen.",
        "Username or Password is wrong.": "Benutzername oder Passwort sind falsch.",
        "name": "Name",
        "identifier": "Kennung",
        "idType": "Kennung Typ",
        'childCompany': "Kinder Unternehmen",
        "edit": "redigieren",
        "findCompany": "Finden Sie Unternehmen",
        "addCompany": "Unternehmen hinzufügen",
        "parentComp": "Muttergesellschaft",
        "saveChange": "Sparen",
        "editComp": "Bearbeiten Firma",
        "listChildren": "Liste Kinder",
        "reset":"Zurücksetzen",
        "refresh": "Aktualisieren",
        'policy': 'Durch Klicken auf Anmelden akzeptieren Sie die Elemica',
        "paccept": "Datenschutz-Bestimmungen",
        "finduser": "Nutzer finden",
        "adduser": "Benutzer hinzufügen",
        "fname": "Vorname",
        "lname": "Nachname",
        "email": "Email",
        "phone": "Telefon",
        "llogin": "Letzte Anmeldung",
        "locate": "lokalisieren",
        "home": "Zuhause",
        "comps":"Firmen",
        "users": "Benutzer",
        "products": "Produkte",
        "edituser": "Benutzer bearbeiten",
        "confirmpass": "Passwort bestätigen",
        'itemPerPage': "Artikel pro Seite",
        'searchName': 'Suche nach Namen',
        'searchCompany': 'Suche nach Unternehmen',
        'searchId': "Suche nach ID",
        'searchUser': 'Suche nach Benutzer',
        'compId': 'Unternehmen',
        'rolename': 'Rolle Name',
        'companyRole': 'Firma Rolle',
        'userRoles': 'Benutzerrollen',
        'addRole': 'fügen Rolle',
        'noRoles': 'Es gibt keine Rollen für dieses Unternehmen',
        'uRole': 'Benutzerrollen',
        'add': 'HINZUFÜGEN',
        'deleteRole': 'Rolle löschen',
        'Upload Product XReference': 'Produkt hochladen',
        'Products XReference File': 'Upload Artikel Datei',
        'findproduct': 'Finden Sie Produkt',
        'searchProduct': 'Suche nach Produkt',
        'addProduct': 'Produkt hinzufügen',
        'description': 'Bezeichnung',
        'editProduct': 'Produkt bearbeiten',
        'reference': 'Querverweis',
        'productId': 'Produkt ID',
        'productName': 'Produktname',
        'companyProducts': 'Unternehmen Produkte',
        'bi': 'Richtungs-bi',
        'uni': 'Richtungs-uni',
        'addRef': 'Verweis hinzufügen',
        "UserIdRequired": 'User Info Erforderlich',
        'logout': 'abmelden'
      })
      .translations('Chinese', {
        "views.main.Username":'用户名',
        "views.main.Password": '密码',
        "passwordTip": "密码必须包含至少一个大写，一个小写，一个数字和一个特殊字符",
        "directives.language-select.Language":'语言',
        "views.main.cancel": "取消",
        "en-option": "英语",
        "de-option": "德国",
        "ch-option":"中国",
        "Login": "登录",
        "User-Enter": '输入用户名',
        "Pass-Enter": "输入密码",
        "UserPassRequired": "这两个用户名和密码是必需的.",
        "BadUser": "无效的用户名或密码！",
        "lang":'语言',
        "title": "供应链运营网络",
        "forgotPassword": "忘了密码！",
        "loginBlock": "登录块",
        "oldPass": "当前密码",
        "newPass": "新密码",
        "changePass": "更改密码",
        "gobackLogin": "返回首页",
        "PASSWORD_TOO_SHORT": "密码太短",
        "PASSWORD_INSUFFICIENT_LOWERCASE": "密码必须包含至少一个小写",
        "PASSWORD_INSUFFICIENT_UPPERCASE": "密码必须包含至少一个大写",
        "PASSWORD_INSUFFICIENT_DIGIT": "密码必须包含至少一个数字",
        "PASSWORD_INSUFFICIENT_SPECIAL": "密码必须包含至少一个特殊字符",
        "New password failed validation.": "新密码验证失败。",
        "Username or Password is wrong.": "用户名或密码错误。",
        "name": "名字",
        "identifier": "识别码",
        "idType": "标识符类型",
        "childCompany": "儿童公司",
        'edit': "编辑",
        "findCompany": "查找公司",
        "addCompany": "添加公司",
        "parentComp": "母公司",
        "saveChange": "保存",
        "editComp": "编辑公司",
        "listChildren": "名单儿童",
        "reset": "重置",
        "refresh": "刷新",
        'policy': '点击登录您接受Elemica公司',
        "paccept": "隐私政策",
        "finduser": "查找用户",
        "adduser": "添加用户",
        "fname": "名字",
        "lname": "姓",
        "email": "电子邮件",
        "phone": "电话",
        "llogin": "上次登录",
        "locate": "找到",
        "home": "家",
        "comps": "企业",
        "users": "用户",
        "products": "制品",
        "edituser": "编辑用户",
        'confirmpass': "确认密码",
        'itemPerPage': '每页项目',
        'searchName': '搜索名称',
        'searchCompany': '搜索公司',
        'searchId': "搜索鉴定",
        'searchUser': '搜索用户',
        'compId': '公司标识',
        'rolename': '角色名称',
        'companyRole': '公司角色',
        'userRoles': '用户角色',
        'addRole': '添加角色',
        'noRoles': '目前这家公司的任何角色',
        'uRole': '用户角色',
        'add': '加',
        'deleteRole': '删除角色',
        'Upload Product XReference': '上传产品',
        'Products XReference File': '上传产品文件',
        'findproduct': '查找产品',
        'searchProduct': '搜索产品',
        'addProduct': '添加产品',
        'description': '描写',
        'editProduct': '编辑产品',
        'reference': '交叉参考',
        'productId': '产品编号',
        'productName': '产品名',
        'companyProducts': '公司产品',
        'bi': '双定向',
        'uni': '单向的，',
        'addRef': '添加引用',
        "UserIdRequired": '用户信息要求',
        'logout': '登出'

      });
    //$translateProvider.useLocalStorage();
    $translateProvider.preferredLanguage('English');// is applied on first load
  }]);

angular.module('apollo-login.templates', ['views/lockedLogin.html', 'views/login.html', 'views/md-lockedLogin.html', 'views/md-login.html']);

angular.module('views/lockedLogin.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('views/lockedLogin.html',
    '<style>.masterDataBody {\n' +
    '    background-color: #25aae1;\n' +
    '    background: #25aae1 -webkit-image-set(url("/app/images/login-background-1x.png") 1x,url("/app/images/login-background-2x.png") 2x) no-repeat;\n' +
    '    font-family: "Open Sans","Helvetica Neue",Helvetica,Arial,sans-serif;\n' +
    '    font-weight: 400;\n' +
    '    font-size: 14px;}\n' +
    '  #navContainer { display: none;\n' +
    '  }</style><div class=container align=center ng-controller=lockedLoginController><div id=loginTitle class=container>{{"title" | translate }}</div><img class=img-responsive id=loginLogo alt="Elemica Logo" src="images/new-elemica-logo-2x.png"><br style="line-height: 20px"><div class=lang><select id=dropDownSelected class="btn btn-primary" ng-model=selectItem ng-options="language for language in languages" ng-change=switchLanguage()><option default selected=selected class=langOption>{{ "lang" | translate }}</option></select></div><div id=loginClass class=form-group><input class=form-control id=username placeholder="{{&quot;User-Enter&quot; | translate }}" ng-model=username ng-keypress=checkForEnter($event)> <input type=password class=form-control ng-model=oldPassword id=password placeholder="{{ &quot;oldPass&quot; | translate }}" ng-keypress=checkForEnter($event)> <input type=password class=form-control ng-model=newPassword id=password placeholder="{{\'newPass\' | translate }}" ng-keypress=checkFOrEnter($event)> <input type=password class=form-control ng-model=confirmNewPassword id=password placeholder="{{ \'confirmpass\' | translate }}" ng-keypress=checkForEnter($event)></div><div class=alert id=redAlert><div class="alert alert-danger" id=badLogin type=danger ng-show=passError close=closeReasonAlert()><button type=button class=close data-dismiss=alert aria-hidden=true>&times;</button><br><p ng-model=violationError>{{ violationError | translate }}</p><br><ul ng-model=errorReason><li ng-repeat="error in errorReason">{{ error | translate }}</li></ul></div></div><div id=bottomPage class=bp><div id=loginButton class=bp1><a ng-click=goToLogin() id=fpassword><span class="fa fa-arrow-left"></span>&nbsp;&nbsp;{{ \'gobackLogin\' | translate }}</a> <button id=loginBtn class=btn-defualt ng-click=changePassword()>{{"changePass" | translate }}</button></div></div></div>');
}]);

angular.module('views/login.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('views/login.html',
    '<style>body {\n' +
    '    background: #25aae1 -webkit-image-set(url("/app/images/login-background-1x.png") 1x,url("/app/images/login-background-2x.png") 2x) no-repeat;\n' +
    '    font-family: "Open Sans","Helvetica Neue",Helvetica,Arial,sans-serif;}\n' +
    '  #navContainer { display: none;\n' +
    '  }</style><div class=container align=center ng-controller=LoginCtrl><p id=loginTitle>{{"title" | translate }}</p><img class=img-responsive id=loginLogo alt="Elemica Logo" src="/app/images/new-elemica-logo-2x.png"><br style="line-height: 20px"><div class=lang><select id=dropDownSelected class="btn btn-primary" ng-model=selectItem ng-options="language for language in languages" ng-change=switchLanguage()><option default selected=selected class=langOption>{{ "lang" | translate }}</option></select></div><div id=loginClass class=form-group><input class=form-control id=username placeholder="{{&quot;User-Enter&quot; | translate }}" ng-model=user.username ng-keypress=checkForEnter($event)> <input type=password class=form-control ng-model=user.password id=password placeholder="{{&quot;Pass-Enter&quot; | translate }}" ng-keypress=checkForEnter($event)></div><div class=alert id=redAlert><div class="alert alert-danger" id=badLogin popover=hi type=danger ng-show=missingError close=closeRequiredAlert()>{{ "UserPassRequired" | translate }} <button type=button class=close aria-hidden=true>&times;</button></div><div class="alert alert-danger" id=badLogin type=danger ng-show=badUsernameOrPassword close=closeBadAlert()>{{ "BadUser" | translate }} <button type=button class=close data-dismiss=alert aria-hidden=true ng-click=closeBadAlert()>&times;</button></div></div><div id=bottomPage><div id=loginButton class=bp1><a href="" id=fpassword>Forgot Password?</a> <button id=loginBtn class=btn-defualt ng-click=ok()>{{"Login" | translate }}</button></div><div id=policy class=container><p>{{ \'policy\' | translate }} <a id=policyWord href={{privacy}} target=_blank>{{ \'paccept\' | translate }}</a></p></div></div></div>');
}]);

angular.module('views/md-lockedLogin.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('views/md-lockedLogin.html',
    '<style>body {\n' +
    '    background-color: #25aae1;\n' +
    '    background: #25aae1 -webkit-image-set(url("/app/images/login-background-1x.png") 1x,url("/app/images/login-background-2x.png") 2x) no-repeat;\n' +
    '    font-family: "Open Sans","Helvetica Neue",Helvetica,Arial,sans-serif;\n' +
    '    font-weight: 400;\n' +
    '    font-size: 14px;\n' +
    '  #navContainer { display: none;\n' +
    '  }</style><div class=container align=center ng-controller=lockedLoginController><div id=loginTitle class=container>{{"title" | translate }}</div><img class=img-responsive id=loginLogo alt="Elemica Logo" src="/app/images/new-elemica-logo-2x.png"><br style="line-height: 20px"><div class=lang><select id=dropDownSelected class="btn btn-primary" ng-model=selectItem ng-options="language for language in languages" ng-change=switchLanguage()><option default selected=selected class=langOption>{{ "lang" | translate }}</option></select></div><br><br><h1 class=hidden-xs id=warnLogin>{{ "PASSWORD_EXPIRED" | translate}}</h1><h4 class=visible-xs id=warnLogin>{{ "PASSWORD_EXPIRED" | translate}}</h4><div id=loginClass class=form-group><input class=form-control id=username placeholder="{{&quot;User-Enter&quot; | translate }}" ng-model=username ng-keypress=checkForEnter($event)> <input type=password class=form-control ng-model=oldPassword id=password placeholder="{{ &quot;oldPass&quot; | translate }}" ng-keypress=checkForEnter($event)> <input type=password class=form-control ng-model=newPassword id=password placeholder="{{\'newPass\' | translate }}" ng-keypress=checkFOrEnter($event)> <input type=password class=form-control ng-model=confirmNewPassword id=password placeholder="{{ \'confirmpass\' | translate }}" ng-keypress=checkForEnter($event)></div><div class=alert id=redAlert><div class="alert alert-danger" id=badLogin_3 type=danger ng-show=passError>{{ violationError | translate }} <button type=button class=close aria-hidden=true ng-click=closeReasonAlert()>&times;</button><br><br><ul ng-model=errorReason><li ng-repeat="error in errorReason">{{ error | translate }}</li></ul></div></div><div id=bottomPage class=bp><div id=loginButton class=bp1><a ng-click=goToLogin() id=fpassword><span class="fa fa-arrow-left"></span>&nbsp;&nbsp;{{ \'gobackLogin\' | translate }}</a> <button id=loginBtn class=btn-defualt ng-click=changePassword()>{{"changePass" | translate }}</button></div></div></div>');
}]);

angular.module('views/md-login.html', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('views/md-login.html',
    '<style>body {\n' +
    '    background-color: #25aae1;\n' +
    '    background: #25aae1 -webkit-image-set(url("/app/images/login-background-1x.png") 1x,url("/app/images/login-background-2x.png") 2x) no-repeat;\n' +
    '    font-family: "Open Sans","Helvetica Neue",Helvetica,Arial,sans-serif;\n' +
    '  #navContainer { display: none;\n' +
    '  }</style><div class=container align=center ng-controller=loginController><p id=loginTitle>{{"title" | translate }}</p><img class=img-responsive id=loginLogo alt="Elemica Logo" src="/app/images/new-elemica-logo-2x.png"><br style="line-height: 20px"><div class=lang><select id=dropDownSelected class="btn btn-primary" ng-model=selectItem ng-options="language for language in languages" ng-change=switchLanguage()><option default selected=selected class=langOption>{{ "lang" | translate }}</option></select></div><div id=loginClass class=form-group><input class=form-control id=username placeholder="{{&quot;User-Enter&quot; | translate }}" ng-model=username ng-keypress=checkForEnter($event)> <input type=password class=form-control ng-model=password id=password placeholder="{{&quot;Pass-Enter&quot; | translate }}" ng-keypress=checkForEnter($event)></div><div class=alert id=redAlert><div class="alert alert-danger" id=badLogin type=danger ng-show=missingError close=closeRequiredAlert()>{{ "UserPassRequired" | translate }} <button type=button class=close aria-hidden=true ng-click=closeRequiredAlert()>&times;</button></div><div class="alert alert-danger" id=badLogin_2 type=danger ng-show=badUsernameOrPassword>{{ "BadUser" | translate }} you have {{remainNumber}} more attempt. <button type=button class=close aria-hidden=true ng-click=closeBadAlert()>&times;</button></div><div class="alert alert-danger" id=badLogin type=danger ng-show=locked>{{ "PASSWORD_ACCOUNT_LOCKED" | translate }} support@elemica.com <button type=button class=close aria-hidden=true ng-click=closeLockAlert()>&times;</button></div></div><form id=bottomPage><div id=loginButton class=hidden-xs><a href="" id=fpassword_1>{{ \'forgotPassword\' | translate }}</a> <button id=loginBtn class=btn-defualt ng-click=ok()>{{"Login" | translate }}</button></div><div id=loginButton class=visible-xs><a href="" id=fpassword>{{ \'forgotPassword\' | translate }}</a> <button id=loginBtn class=btn-defualt ng-click=ok()>{{"Login" | translate }}</button></div><div class=container><p id=policy>{{ \'policy\' | translate }} <a id=policyWord href={{privacy}} target=_blank>{{ \'paccept\' | translate }}</a></p></div></form></div>');
}]);

/**
 * Created by qmarcelle on 3/28/2016.
 */

//Interceptor for store the token into header for all calls
angular.module('auth', [])
  .factory("loginInterceptor",[ function(authManager) {
    var loginIntercept ={
      request: function(config) {
        config.headers = config.headers || {};
        if (localStorage.auth_token && localStorage.auth_token != '') {
          config.headers['X-AUTH-TOKEN'] = localStorage.auth_token;
        };
        return config;
      },
      response: function(res) {
        return res;
      }
    };
    return loginIntercept;
  }]).config(['$httpProvider', function($httpProvider){
  $httpProvider.interceptors.push('loginInterceptor');

}]);

/**
 * Created by qmarcelle on 3/28/2016.
 */
'use strict';

//translateProvider to translate to different languages
angular.module("translationLogin", ['pascalprecht.translate'])

  .config(['$translateProvider', function ($translateProvider) {

    $translateProvider.translations('English', {
        "views.main.Username":'Username',
        "passwordTip": "Password Must contains at least one uppercase, one lowercase, one number, and one special character",
        "views.main.Password": 'Password',
        "directives.language-select.Language":'Language',
        "views.main.cancel": "Cancel",
        "en-option": "English",
        "de-option": "German",
        "ch-option": "Chinese",
        "Login": "LOGIN",
        "User-Enter": "Username",
        "Pass-Enter": "Password",
        "UserPassRequired": "Both Username and Password are required.",
        "BadUser": "Invalid Username or Password!",
        "lang":'Language',
        "title": "SUPPLY CHAIN OPERATING NETWORK",
        "forgotPassword": "Forgot Password!",
        "loginBlock": "Login Block",
        "oldPass": "Current Password",
        "newPass": "New Password",
        "changePass": "change Password",
        "gobackLogin": "Go back to login",
        "PASSWORD_TOO_SHORT": "Password must has atleast 8 character",
        "PASSWORD_INSUFFICIENT_LOWERCASE": "Password must contain at least one lowercase",
        "PASSWORD_INSUFFICIENT_UPPERCASE": "Password must contain at least one uppercase",
        "PASSWORD_INSUFFICIENT_DIGIT": "Password must contain at least one digit",
        "PASSWORD_INSUFFICIENT_SPECIAL": "Password must contain at least one special character",
        "New password failed validation.": "New password failed validation.",
        "PASSWORD_EXPIRED": "Your password has expired and must be changed",
        "PASSWORD_ACCOUNT_LOCKED": "Your account is locked, to unlock your account contact us",
        "Username or Password is wrong.": "Username or Password is wrong.",
        "name": "Name",
        "identifier": 'Identifier',
        "id": "id",
        "idType": "Identifier Type",
        "type": "Type",
        "childCompany": "Child Company",
        "child": "child",
        "edit": "Edit",
        "findCompany": "Find Company",
        "addCompany": "ADD COMPANY",
        "parentComp": "Parent Company",
        "saveChange": "Save",
        "editComp": "Edit Company",
        "listChildren": "List Children",
        "reset": "Reset",
        "refresh": "Refresh",
        "policy": 'By clicking Login you accept the Elemica',
        "paccept": "Privacy Policy",
        "finduser": "Find User",
        "adduser": "ADD USER",
        "fname": "First Name",
        "lname": "Last Name",
        "email": "Email",
        "phone": "Phone",
        "llogin": "Last Login",
        "locate": "Location",
        "home": "Home",
        "comps": "Companies",
        "users": "Users",
        "products": "Products",
        "edituser": "Edit User",
        'confirmpass': "Confirm Password",
        'itemPerPage': "Items per page",
        'searchName': 'Search for Name',
        'searchCompany': 'Search for Company',
        'searchId': "Search for ID",
        "searchUser": 'Search for User',
        "compId": "Company",
        'rolename': 'Role Name',
        'companyRole': 'Company Roles',
        'userRoles': 'User Roles',
        'addRole': 'Add Role',
        'noRoles': "There is no role for this company",
        'uRole': 'User Roles',
        'add': 'ADD',
        'deleteRole': 'Delete Role',
        'Upload Product XReference': 'Upload Product XReference',
        'Products XReference File': 'Products XReference File',
        'findproduct': 'Find Product',
        'searchProduct': 'Search for Product',
        'addProduct': 'ADD PRODUCT',
        'description': 'Description',
        'editProduct': 'Edit Product',
        'reference': 'Cross References',
        'productId': 'Product Id',
        'searchProduct': 'Search for Product',
        'productName': 'Product Name',
        'companyProducts': 'Company Products',
        'delete': 'delete',
        'bi': 'Bi Directional',
        'uni': 'Uni Directional',
        'addRef': 'Add Cross Reference',
        "UserIdRequired": 'User Info Required',
        'logout': 'Logout'

      })
      .translations('German', {
        "views.main.Username":'Benutzername',
        "views.main.Password": 'Passwort',
        "passwordTip": "Das Passwort muss mindestens einen Großbuchstaben , einen Klein, eine Zahl und ein Sonderzeichen",
        "directives.language-select.Language":'Sprache',
        "views.main.cancel": "stornieren",
        "de-option": "deutsch",
        "en-option": "englisch",
        "ch-option": "Chinesisch",
        "Login": "Einloggen",
        "User-Enter": "Benutzername",
        "Pass-Enter": "Passwort",
        "UserPassRequired": "Sowohl Benutzername und Kennwort erforderlich.",
        "BadUser": "Ungültiger Benutzername oder Passwort!",
        "lang": "Sprache",
        "title": "Supply-Chain-Netzwerkbetriebs",
        "forgotPassword": "Passwort vergessen!",
        "loginBlock": "Login Blocken",
        "oldPass": "Aktuelles Passwort",
        "newPass": "Neues Passwort",
        "changePass": "Passwort ändern",
        "gobackLogin": "Zurück zum Login",
        "PASSWORD_TOO_SHORT": "Passwort ist zu kurz",
        "PASSWORD_INSUFFICIENT_LOWERCASE": "Das Passwort muss mindestens einen Klein enthalten",
        "PASSWORD_INSUFFICIENT_UPPERCASE": "Das Passwort muss mindestens einen Groß enthalten",
        "PASSWORD_INSUFFICIENT_DIGIT": "Das Passwort muss mindestens eine Ziffer enthalten",
        "PASSWORD_INSUFFICIENT_SPECIAL": "Das Passwort muss mindestens ein Sonderzeichen enthalten",
        "New password failed validation.": "Neues Passwort Überprüfung fehlgeschlagen.",
        "PASSWORD_EXPIRED": "Einige Kennwort ist abgelaufen und muss geändert werden",
        "PASSWORD_ACCOUNT_LOCKED": "Ihr Konto ist gesperrt, zu entsperren Ihr Kunden uns",
        "Username or Password is wrong.": "Benutzername oder Passwort sind falsch.",
        "name": "Name",
        "identifier": "Kennung",
        "id": "Ich würde",
        "idType": "Kennung Typ",
        "type": "Art",
        'childCompany': "Kinder Unternehmen",
        "child": "Kind",
        "edit": "redigieren",
        "findCompany": "Finden Sie Unternehmen",
        "addCompany": "Unternehmen hinzufügen",
        "parentComp": "Muttergesellschaft",
        "saveChange": "Sparen",
        "editComp": "Bearbeiten Firma",
        "listChildren": "Liste Kinder",
        "reset":"Zurücksetzen",
        "refresh": "Aktualisieren",
        'policy': 'Durch Klicken auf Anmelden akzeptieren Sie die Elemica',
        "paccept": "Datenschutz-Bestimmungen",
        "finduser": "Nutzer finden",
        "adduser": "Benutzer hinzufügen",
        "fname": "Vorname",
        "lname": "Nachname",
        "email": "Email",
        "phone": "Telefon",
        "llogin": "Letzte Anmeldung",
        "locate": "lokalisieren",
        "home": "Zuhause",
        "comps":"Firmen",
        "users": "Benutzer",
        "products": "Produkte",
        "edituser": "Benutzer bearbeiten",
        "confirmpass": "Passwort bestätigen",
        'itemPerPage': "Artikel pro Seite",
        'searchName': 'Suche nach Namen',
        'searchCompany': 'Suche nach Unternehmen',
        'searchId': "Suche nach ID",
        'searchUser': 'Suche nach Benutzer',
        'compId': 'Unternehmen',
        'rolename': 'Rolle Name',
        'companyRole': 'Firma Rolle',
        'userRoles': 'Benutzerrollen',
        'addRole': 'fügen Rolle',
        'noRoles': 'Es gibt keine Rollen für dieses Unternehmen',
        'uRole': 'Benutzerrollen',
        'add': 'HINZUFÜGEN',
        'deleteRole': 'Rolle löschen',
        'Upload Product XReference': 'Produkt hochladen',
        'Products XReference File': 'Upload Artikel Datei',
        'findproduct': 'Finden Sie Produkt',
        'searchProduct': 'Suche nach Produkt',
        'addProduct': 'Produkt hinzufügen',
        'description': 'Bezeichnung',
        'editProduct': 'Produkt bearbeiten',
        'reference': 'Querverweis',
        'productId': 'Produkt ID',
        'productName': 'Produktname',
        'companyProducts': 'Unternehmen Produkte',
        'delete': 'löschen',
        'bi': 'Richtungs-bi',
        'uni': 'Richtungs-uni',
        'addRef': 'Verweis hinzufügen',
        "UserIdRequired": 'User Info Erforderlich',
        'logout': 'abmelden'
      })
      .translations('Chinese', {
        "views.main.Username":'用户名',
        "views.main.Password": '密码',
        "passwordTip": "密码必须包含至少一个大写，一个小写，一个数字和一个特殊字符",
        "directives.language-select.Language":'语言',
        "views.main.cancel": "取消",
        "en-option": "英语",
        "de-option": "德国",
        "ch-option":"中国",
        "Login": "登录",
        "User-Enter": '输入用户名',
        "Pass-Enter": "输入密码",
        "UserPassRequired": "这两个用户名和密码是必需的.",
        "BadUser": "无效的用户名或密码！",
        "lang":'语言',
        "title": "供应链运营网络",
        "forgotPassword": "忘了密码！",
        "loginBlock": "登录块",
        "oldPass": "当前密码",
        "newPass": "新密码",
        "changePass": "更改密码",
        "gobackLogin": "返回首页",
        "PASSWORD_TOO_SHORT": "密码太短",
        "PASSWORD_INSUFFICIENT_LOWERCASE": "密码必须包含至少一个小写",
        "PASSWORD_INSUFFICIENT_UPPERCASE": "密码必须包含至少一个大写",
        "PASSWORD_INSUFFICIENT_DIGIT": "密码必须包含至少一个数字",
        "PASSWORD_INSUFFICIENT_SPECIAL": "密码必须包含至少一个特殊字符",
        "New password failed validation.": "新密码验证失败。",
        "PASSWORD_EXPIRED": "有人password哈斯expired案的牧师唐碧娥嫦娥的",
        "PASSWORD_ACCOUNT_LOCKED": "您的帐户被锁定, 解锁您的帐户与我们联系",
        "Username or Password is wrong.": "用户名或密码错误。",
        "name": "名字",
        "identifier": "识别码",
        "id": "ID",
        "idType": "标识符类型",
        "type": "类型",
        "childCompany": "儿童公司",
        "child": "儿童",
        'edit': "编辑",
        "findCompany": "查找公司",
        "addCompany": "添加公司",
        "parentComp": "母公司",
        "saveChange": "保存",
        "editComp": "编辑公司",
        "listChildren": "名单儿童",
        "reset": "重置",
        "refresh": "刷新",
        'policy': '点击登录您接受Elemica公司',
        "paccept": "隐私政策",
        "finduser": "查找用户",
        "adduser": "添加用户",
        "fname": "名字",
        "lname": "姓",
        "email": "电子邮件",
        "phone": "电话",
        "llogin": "上次登录",
        "locate": "找到",
        "home": "家",
        "comps": "企业",
        "users": "用户",
        "products": "制品",
        "edituser": "编辑用户",
        'confirmpass': "确认密码",
        'itemPerPage': '每页项目',
        'searchName': '搜索名称',
        'searchCompany': '搜索公司',
        'searchId': "搜索鉴定",
        'searchUser': '搜索用户',
        'compId': '公司标识',
        'rolename': '角色名称',
        'companyRole': '公司角色',
        'userRoles': '用户角色',
        'addRole': '添加角色',
        'noRoles': '目前这家公司的任何角色',
        'uRole': '用户角色',
        'add': '加',
        'deleteRole': '删除角色',
        'Upload Product XReference': '上传产品',
        'Products XReference File': '上传产品文件',
        'findproduct': '查找产品',
        'searchProduct': '搜索产品',
        'addProduct': '添加产品',
        'description': '描写',
        'editProduct': '编辑产品',
        'reference': '交叉参考',
        'productId': '产品编号',
        'productName': '产品名',
        'companyProducts': '公司产品',
        'delete': '删除',
        'bi': '双定向',
        'uni': '单向的，',
        'addRef': '添加引用',
        "UserIdRequired": '用户信息要求',
        'logout': '登出'

      });
    //$translateProvider.useLocalStorage();
    $translateProvider.preferredLanguage('English');// is applied on first load
  }]);
