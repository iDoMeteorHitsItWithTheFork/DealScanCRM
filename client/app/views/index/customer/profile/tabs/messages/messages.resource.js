/**
 * Created by ludovicagodio on 8/22/16.
 */
'use strict';

(function () {
  function MessageResource($resource) {
    return $resource('/api/messages/:id/:controller', {
        id: '@messageID'
      },
      {
        update: {
          method:'PUT',
        },
        reloadInbox: {
          method: 'GET',
          isArray: true,
          params: {
            id: 'reload',
            controller: 'inbox'
          }
        }
      });
  }

  angular.module('dealScanCrmApp')
    .factory('MessageResource', MessageResource);

})();
/**
 * Created by ludovicagodio on 8/6/16.
 */
