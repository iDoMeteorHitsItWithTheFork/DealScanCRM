'use strict';

(function () {

  function CustomerResource($resource) {
    return $resource('/api/customers/:id/:controller', {
      id: '@customerID'
    }, {

    });
  }

  angular.module('dealScanCrmApp')
    .factory('CustomerResource', CustomerResource);

})();
