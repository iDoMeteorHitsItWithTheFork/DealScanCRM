'use strict';

describe('Controller: AssignLeadCtrl', function () {

  // load the controller's module
  beforeEach(module('dealscanCrmApp'));

  var AssignLeadCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AssignLeadCtrl = $controller('AssignLeadCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
