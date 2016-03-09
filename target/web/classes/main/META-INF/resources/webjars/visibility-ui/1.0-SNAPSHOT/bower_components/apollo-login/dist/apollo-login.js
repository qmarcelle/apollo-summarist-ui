angular.module('apollo-login',['ui.router','ngResource','ngSanitize','ngAnimate','md.data.table','myApp.version','pascalprecht.translate','translationLogin','apollo-login.templates']);'use strict';
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

/**
 * Created by qmarcelle on 11/13/2015.
 */

/**
 * Created by qmarcelle on 11/5/2015.
 */

//Interceptor for store the token into header for all calls
app.service('Auth',['$http', 'session','$state', '$location',function ($http, session,$state, $location){
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
            session.setAccessToken(data.authToken);
            //session.setInvalid(false);
            console.log("tried to post to login");
            //set the token variable
            token = session.getAccessToken();
            /*/!*if ($rootScope.state) {
              $state.go($rootScope.state);
            } else {
              $state.go('companies');
            }*!/*/
            $location.path('/supply_chain')
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

  }]);


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
    this._accessToken = JSON.parse(localStorage.getItem('auth_token'));

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
      this._accessToken = angular.toJson(token);
      localStorage['auth_token'] = angular.toJson(token);
      return this;
    };

    this.destroy = function destroy(){
      this.setUser()
        .setAccessToken(null);
      return this;
    };

  }]);

/**
 * Created by qmarcelle on 11/13/2015.
 */

'use strict';

//translateProvider to translate to different languages
angular.module("translationLogin", ['pascalprecht.translate'])

  .config(['$translateProvider', function ($translateProvider) {

    $translateProvider.translations('English', {
      "views.main.Username":'Username',
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
      "BadUser": "Bad Username or Password!",
      "lang":'Language',
      "title": "SUPPLY CHAIN OPERATING NETWORK",
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
      "locate": "Locate",
      "home": "Home",
      "comps": "Companies",
      "users": "Users",
      "products": "Products",
      "edituser": "Edit User",
      'confirmpass': "Confirm Password",
      'itemPerPage': "Items per page",
      'searchName': 'Search for Name',
      'searchId': "Search for ID",
      "searchUser": 'Search for User',
      "compId": "Company",
      'rolename': 'Role Name',
      'companyRole': 'Company Roles',
      'addRole': 'Add Role',
      'noRoles': "There is no roles for this company",
      'uRole': 'User Roles',
      'add': 'ADD',
      'Upload Product XReference': 'Upload Product XReference',
      'Products XReference File': 'Products XReference File',
      'findproduct': 'Find Product',
      'addProduct': 'ADD PRODUCT',
      'description': 'Description',
      'editProduct': 'Edit Product',
      'reference': 'XReferences',
      'productId': 'Product Id',
      'productName': 'Product Name',
      'companyProducts': 'Company Products',
      'bi': 'Bi Directional',
      'uni': 'Uni Directional',
      'addRef': 'Add Reference'

    })
      .translations('German', {
        "views.main.Username":'Benutzername',
        "views.main.Password": 'Passwort',
        "directives.language-select.Language":'Sprache',
        "views.main.cancel": "stornieren",
        "de-option": "deutsch",
        "en-option": "englisch",
        "ch-option": "Chinesisch",
        "Login": "Einloggen",
        "User-Enter": "Benutzername",
        "Pass-Enter": "Passwort",
        "UserPassRequired": "Sowohl Benutzername und Kennwort erforderlich.",
        "BadUser": "Bad Benutzername oder Passwort!",
        "lang": "Sprache",
        "title": "Supply-Chain-Netzwerkbetriebs",
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
        'searchId': "Suche nach ID",
        'searchUser': 'Suche nach Benutzer',
        'compId': 'Unternehmen',
        'rolename': 'Rolle Name',
        'companyRole': 'Firma Rolle',
        'addRole': 'fügen Rolle',
        'noRoles': 'Es gibt keine Rollen für dieses Unternehmen',
        'uRole': 'Benutzerrollen',
        'add': 'HINZUFÜGEN',
        'Upload Product XReference': 'Produkt hochladen',
        'Products XReference File': 'Upload Artikel Datei',
        'findproduct': 'Finden Sie Produkt',
        'addProduct': 'Produkt hinzufügen',
        'description': 'Bezeichnung',
        'editProduct': 'Produkt bearbeiten',
        'reference': 'Hinweis',
        'productId': 'Produkt ID',
        'productName': 'Produktname',
        'companyProducts': 'Unternehmen Produkte',
        'bi': 'Richtungs-bi',
        'uni': 'Richtungs-uni',
        'addRef': 'Verweis hinzufügen'
      })
      .translations('Chinese', {
        "views.main.Username":'用户名',
        "views.main.Password": '密码',
        "directives.language-select.Language":'语言',
        "views.main.cancel": "取消",
        "en-option": "英语",
        "de-option": "德国",
        "ch-option":"中国",
        "Login": "登录",
        "User-Enter": '输入用户名',
        "Pass-Enter": "输入密码",
        "UserPassRequired": "这两个用户名和密码是必需的.",
        "BadUser": "错误的用户名或密码！",
        "lang":'语言',
        "title": "供应链运营网络",
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
        'searchId': "搜索鉴定",
        'searchUser': '搜索用户',
        'compId': '公司标识',
        'rolename': '角色名称',
        'companyRole': '公司角色',
        'addRole': '添加角色',
        'noRoles': '目前这家公司的任何角色',
        'uRole': '用户角色',
        'add': '加',
        'Upload Product XReference': '上传产品',
        'Products XReference File': '上传产品文件',
        'findproduct': '查找产品',
        'addProduct': '添加产品',
        'description': '描写',
        'editProduct': '编辑产品',
        'reference': '参考',
        'productId': '产品编号',
        'productName': '产品名',
        'companyProducts': '公司产品',
        'bi': '双定向',
        'uni': '单向的，',
        'addRef': '添加引用'

      });
    //$translateProvider.useLocalStorage();
    $translateProvider.preferredLanguage('English');// is applied on first load
  }]);

angular.module('apollo-login.templates', ['views/lockedLogin.html', 'views/login.html']);

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
    '\n' +
    '    background: #25aae1 -webkit-image-set(url("/app/images/login-background-1x.png") 1x,url("/app/images/login-background-2x.png") 2x) no-repeat;\n' +
    '    font-family: "Open Sans","Helvetica Neue",Helvetica,Arial,sans-serif;}\n' +
    '  #navContainer { display: none;\n' +
    '  }</style><div class=container align=center ng-controller=LoginCtrl><p id=loginTitle>{{"title" | translate }}</p><img class=img-responsive id=loginLogo alt="Elemica Logo" src="/app/images/new-elemica-logo-2x.png"><br style="line-height: 20px"><div class=lang><select id=dropDownSelected class="btn btn-primary" ng-model=selectItem ng-options="language for language in languages" ng-change=switchLanguage()><option default selected=selected class=langOption>{{ "lang" | translate }}</option></select></div><div id=loginClass class=form-group><input class=form-control id=username placeholder="{{&quot;User-Enter&quot; | translate }}" ng-model=user.username ng-keypress=checkForEnter($event)> <input type=password class=form-control ng-model=user.password id=password placeholder="{{&quot;Pass-Enter&quot; | translate }}" ng-keypress=checkForEnter($event)></div><div class=alert id=redAlert><div class="alert alert-danger" id=badLogin popover=hi type=danger ng-show=missingError close=closeRequiredAlert()>{{ "UserPassRequired" | translate }} <button type=button class=close aria-hidden=true>&times;</button></div><div class="alert alert-danger" id=badLogin type=danger ng-show=badUsernameOrPassword close=closeBadAlert()>{{ "BadUser" | translate }} <button type=button class=close data-dismiss=alert aria-hidden=true ng-click=closeBadAlert()>&times;</button></div></div><div id=bottomPage><div id=loginButton class=bp1><a href="" id=fpassword>Forgot Password?</a> <button id=loginBtn class=btn-defualt ng-click=ok()>{{"Login" | translate }}</button></div><div id=policy class=container><p>{{ \'policy\' | translate }} <a id=policyWord href={{privacy}} target=_blank>{{ \'paccept\' | translate }}</a></p></div></div></div>');
}]);
