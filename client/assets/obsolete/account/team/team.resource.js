/**
 * Created by ludovicagodio on 4/1/16.
 */
'use strict';

(function () {

  function TeamResource($resource) {
    return $resource('/api/teams/:id/:controller', {
      id: '@userID'
    }, {
      getTeams: {
        method: 'GET',
        isArray: true,
        params: {
          controller: 'teams'
        }
      },
      getManagers: {
        method: 'GET',
          isArray: true,
          params: {
          controller: 'managers'
        }
      }
    });
  }

  angular.module('dealScanCrmApp')
    .factory('TeamResource', TeamResource);

})();


