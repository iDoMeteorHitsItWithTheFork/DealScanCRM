'use strict';

angular.module('dealScanCrmApp')
  .directive('navbar', function () {
    return {
      templateUrl: 'app/views/common/navbar/topnavbar.html',
      controller: function ($scope, $state, Auth, Dashboard, Lead, $uibModal){
        $scope.days = Dashboard.getRemainingDays();
        $scope.leads = Lead.unassignedLeads();
        $scope.dealers = Auth.getDealerships();
        console.log($scope.leads);
        $scope.logout = function () {
          $state.go('logout');
        }

        $scope.assignLead = function (lead) {
          var modalInstance = $uibModal.open({
            animation: true,
            windowClass: 'slide-up',
            templateUrl: 'app/views/index/bdc/lead/assignLead.html',
            controller: 'AssignLeadCtrl as assignLead',
            resolve: {
              Dealers: function(){
                return $scope.dealers;
              },
              selectedLead: function(){
                return lead;
              },
              loadPlugin: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                  {
                    serie: true,
                    name: 'angular-ladda',
                    files: ['.resources/plugins/ladda/spin.min.js', '.resources/plugins/ladda/ladda.min.js',
                      '.styles/plugins/ladda/ladda-themeless.min.css','.resources/plugins/ladda/angular-ladda.min.js']
                  },
                  {
                    name: 'datePicker',
                    files: ['.styles/plugins/datapicker/angular-datapicker.css','.resources/plugins/datapicker/angular-datepicker.js']
                  },
                  {
                    serie: true,
                    files: ['.resources/plugins/daterangepicker/daterangepicker.js', '.styles/plugins/daterangepicker/daterangepicker-bs3.css']
                  },
                  {
                    name: 'daterangepicker',
                    files: ['.resources/plugins/daterangepicker/angular-daterangepicker.js']
                  },
                  {
                    name: 'ui.select',
                    files: ['.resources/plugins/ui-select/select.min.js',
                      '.styles/plugins/ui-select/select.min.css']
                  }
                ]);
              }
            }
          });
        }
      },
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
