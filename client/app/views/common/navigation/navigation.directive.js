'use strict';

angular.module('dealScanCrmApp')
  .directive('navigation', function () {
    return {
      templateUrl: 'app/views/common/navigation/navigation.html',
      restrict: 'EA',
      controller: 'NavigationCtrl as navigation',
      link: function (scope, element, attrs) {
      }
    };
  });
