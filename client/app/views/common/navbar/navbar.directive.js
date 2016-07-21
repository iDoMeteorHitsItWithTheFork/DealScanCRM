'use strict';

angular.module('dealScanCrmApp')
  .directive('navbar', function () {
    return {
      templateUrl: 'app/views/common/navbar/topnavbar.html',
      controller: function ($scope, $state, Dashboard){
        $scope.days = Dashboard.getRemainingDays();
        $scope.logout = function () {
          $state.go('logout');
        }
      },
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
