/**
 * Created by ludovicagodio on 7/22/16.
 */
'use strict';

(function () {

  function LeadResource($resource) {
    return $resource('/api/leads/:id/:controller', {
        id: '@leadID'
      },
      {
        update: {
          method:'PUT',
        },
      });
  }

  angular.module('dealScanCrmApp')
    .factory('LeadResource', LeadResource);

})();
