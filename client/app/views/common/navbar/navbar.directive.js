'use strict';

angular.module('dealScanCrmApp')
  .directive('navbar', function () {
    return {
      templateUrl: 'app/views/common/navbar/topnavbar.html',
      controller: function ($scope, $state, Dashboard, Lead){
        $scope.days = Dashboard.getRemainingDays();
        $scope.leads = Lead.unassignedLeads();
        $scope.logout = function () {
          $state.go('logout');
        }
      },
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
