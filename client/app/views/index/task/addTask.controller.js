angular.module('dealScanCrmApp')
.controller('AddTaskCtrl',['$scope', '$rootScope', '$timeout', '$compile', '$state', '$window', '$uibModal', '$uibModalInstance','$filter', function ($scope, $rootScope, $timeout, $compile, $state, $window, $uibModal, $uibModalInstance, $filter) {
  console.log("add task controller loaded");

  var _addTask = this;

  _addTask.saving = false;

  _addTask.newTask = {
      rep: '',
      customer: '',
      date: '',
      time: '',
      category: '',
      details: ''
  }

  _addTask.categories = [
    {title: 'Follow-up'},
    {title: 'Documentation'},
    {title: 'Another category'}
  ]

  _addTask.vehicles = [
    {title: '2011 Escape'},
    {title: '2007 Explorer'},
  ]

  _addTask.salesReps = [
    {
      id: 1,
      name: 'Cary Gaskell',
      email: 'carylgaskell@gmail.com'
    },
    {
      id: 2,
      name: 'Luda',
      email: 'luda@gmail.com'
    }
  ]

  _addTask.customers = [
    {
      id: 1,
      name: 'Cary Gaskell',
      email: 'carylgaskell@gmail.com'
    },
    {
      id: 2,
      name: 'Luda',
      email: 'luda@gmail.com'
    }
  ]






  _addTask.today = function () {
    _addTask.dt = new Date();
    };

  _addTask.today();

  _addTask.clear = function () {
    _addTask.dt = null;
    };

  _addTask.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

  _addTask.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  _addTask.format = _addTask.formats[0];

  _addTask.ok = function () {
    $uibModalInstance.close(_addTask.newTask);
  };

  _addTask.cancel = function () {
    $uibModalInstance.dismiss();
  };
  }]);