angular.module('dealScanCrmApp')
.controller('AddEventCtrl',['$scope', '$rootScope', '$timeout', '$compile', '$state', '$window', '$uibModal', '$uibModalInstance','$filter', function ($scope, $rootScope, $timeout, $compile, $state, $window, $uibModal, $uibModalInstance, $filter) {
  console.log("add appointment controller loaded");
  
  var _addEvent = this;
  _addEvent.today = function () {
    _addEvent.dt = new Date();
    };
  _addEvent.today();

  _addEvent.clear = function () {
    _addEvent.dt = null;
    };

  _addEvent.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

  _addEvent.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  _addEvent.format = _addEvent.formats[0];

  _addEvent.newEvent = {'Assignee':'Cary'};
  _addEvent.ok = function () {
    $uibModalInstance.close(_addEvent.newEvent);
  };

  _addEvent.cancel = function () {
    $uibModalInstance.dismiss();
  };
  }]);