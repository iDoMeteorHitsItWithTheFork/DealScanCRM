'use strict';

(function () {

  function CustomerResource($resource) {
    return $resource('/api/customers/:id/:controller', {
      id: '@customerID'
    },
      {
         update: {
           method:'PUT',
         },
         sync: {
           method:'POST',
           params: {
             id: 'sync'
           }
        }
    });
  }

  angular.module('dealScanCrmApp')
    .factory('CustomerResource', CustomerResource);

})();
