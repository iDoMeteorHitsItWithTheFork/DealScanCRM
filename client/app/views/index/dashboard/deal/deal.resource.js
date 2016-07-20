/**
 * Created by ludovicagodio on 6/23/16.
 */
'use strict';

(function () {

  function DealResource($resource) {
    return $resource('/api/deals/:id/:controller', {
      id: '@dealID'
    }, {
      update: {
        method:'PUT',
      },
      sync: {
        method:'POST',
        params: {
          id: 'sync'
        }
      },
      getKPI: {
        method:'GET',
        params: {
          id:'KPI'
        }
      },
    });
  }

  angular.module('dealScanCrmApp')
    .factory('DealResource', DealResource);

})();
