angular.module('dealScanCrmApp')
.controller('AddTaskCtrl',['$scope', '$rootScope', '$timeout', '$compile', '$state', '$window', '$uibModal', '$uibModalInstance','$filter', function ($scope, $rootScope, $timeout, $compile, $state, $window, $uibModal, $uibModalInstance, $filter) {
  console.log("add task controller loaded");
  
   $scope.today = function () {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.dt = null;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

  $scope.lead = {'Assignee':'Cary'};
    $scope.ok = function () {
    $uibModalInstance.close($scope.lead);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
  }]);