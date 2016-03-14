'use strict';

angular.module('dealScanCrmApp')
  .directive('navbar', () => ({
    templateUrl: 'components/navbar/navbar.html',
    restrict: 'E',
    controller: 'NavbarController',
    controllerAs: 'nav'
  }));
angular.module('dealScanCrmApp').directive('ctFullheight', ['$window', '$rootScope', '$timeout',
  function ($window, $rootScope, $timeout, mq) {
    return {
      restrict: "AE",
      scope: {
        ctFullheightIf: '&'
      },
      link: function (scope, elem, attrs) {
        var $win = $($window);
        var $document = $(document);
        var exclusionItems;
        var exclusionHeight;
        var setHeight = true;
        var page;

        scope.initializeWindowSize = function () {
          $timeout(function () {
            exclusionHeight = 0;
            if (attrs.ctFullheightIf) {
              scope.$watch(scope.ctFullheightIf, function (newVal, oldVal) {
                if (newVal && !oldVal) {
                  setHeight = true;
                } else if (!newVal) {
                  $(elem).css('height', 'auto');
                  setHeight = false;
                }
              });
            }

            if (attrs.ctFullheightExclusion) {
              var exclusionItems = attrs.ctFullheightExclusion.split(',');
              angular.forEach(exclusionItems, function (_element) {
                exclusionHeight = exclusionHeight + $(_element).outerHeight(true);
              });
            }
            if (attrs.ctFullheight == 'window') {
              page = $win;
            } else {
              page = $document;
            }

            scope.$watch(function () {
              scope.__height = page.height();
            });
            if (setHeight) {
              $(elem).css('height', 'auto');
              if (page.innerHeight() < $win.innerHeight()) {
                page = $win;
              }
              $(elem).css('height', page.innerHeight() - exclusionHeight);
            }
          }, 300);
        };

        scope.initializeWindowSize();
        scope.$watch('__height', function (newHeight, oldHeight) {
          scope.initializeWindowSize();
        });
        $win.on('resize', function () {
          scope.initializeWindowSize();
        });

      }
    };
  }]);

