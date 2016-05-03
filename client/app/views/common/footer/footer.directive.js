'use strict';

angular.module('dealScanCrmApp')
  .directive('footer', function () {
    return {
      templateUrl: 'app/views/common/footer/footer.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {}
    };
  });
