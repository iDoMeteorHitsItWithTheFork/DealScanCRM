'use strict';

(function () {
  function DocumentResource($resource) {
    return $resource('/api/documents/:id/:controller', {
        id: '@documentID'
      },
      {
        update: {
          method:'PUT',
        },
      });
  }

  angular.module('dealScanCrmApp')
    .factory('DocumentResource', DocumentResource);

})();
/**
 * Created by ludovicagodio on 8/6/16.
 */
