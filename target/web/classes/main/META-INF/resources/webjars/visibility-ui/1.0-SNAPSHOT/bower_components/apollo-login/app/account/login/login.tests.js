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
