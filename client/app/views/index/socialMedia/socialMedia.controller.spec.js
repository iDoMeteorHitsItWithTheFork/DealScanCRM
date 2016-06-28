'use strict';

describe('Controller: SocialMediaCtrl', function () {

  // load the controller's module
  beforeEach(module('dealScanCrmApp'));

  var SocialMediaCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SocialMediaCtrl = $controller('SocialMediaCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
