'use strict';

angular.module('dealScanCrmApp')
  .factory('Deal', function (DealResource) {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
      someMethod: function () {
        return meaningOfLife;
      }
    };


  });
