/**
 * Created by ludovicagodio on 8/22/16.
 */
'use strict';

(function () {
  function MessageResource($resource) {
    return $resource('/api/messages/:id/:controller', {
        id: '@dmessageID'
      },
      {
        update: {
          method:'PUT',
        },
      });
  }

  angular.module('dealScanCrmApp')
    .factory('MessageResource', MessageResource);

})();
/**
 * Created by ludovicagodio on 8/6/16.
 */
