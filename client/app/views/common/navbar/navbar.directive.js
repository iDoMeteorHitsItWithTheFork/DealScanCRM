'use strict';

angular.module('dealScanCrmApp')
  .directive('navbar', function () {
    return {
      templateUrl: 'app/views/common/navbar/topnavbar.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
