/**
 * Created by ludovicagodio on 4/1/16.
 */
'use strict';

(function () {

  function CustomerResource($resource) {
    return $resource('/api/customers/:id/:controller', {
      id: '@userID'
    }, {
      functionName: {
        method: 'GET',
        isArray: true,
        params: {
          controller: ''
        }
      }
    });
  }

  angular.module('dealScanCrmApp')
    .factory('CustomerResource', CustomerResource);

})();



