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
         getDocuments: {
          method:'GET',
          isArray: true,
          params: {
            controller: 'documents'
          }
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
