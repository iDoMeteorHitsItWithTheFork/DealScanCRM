'use strict';

angular.module('dealScanCrmApp')
  .directive('sidebar', function () {
    return {
      templateUrl: 'components/sidebar/sidebar.html',
      restrict: 'EA',
      controller: 'SidebarCtrl',
      controllerAs: 'sidebar',
      link: function (scope, element, attrs) {
      }
    };
  });
