angular.module('dealScanCrmApp')
    .controller('EmailCustomerCtrl', ['$scope', '$rootScope', '$timeout', '$compile', '$state', '$window', '$uibModal', '$uibModalInstance', '$filter', function ($scope, $rootScope, $timeout, $compile, $state, $window, $uibModal, $uibModalInstance, $filter) {
        console.log("email customer controller loaded");

     //   console.log(customer);
    
        $scope.ok = function () {
            console.log($scope.email);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);