'use strict';

(function() {

function UserResource($resource) {
  return $resource('/api/users/:id/:controller', {
    id: '@userID'
  }, {
    changePassword: {
      method: 'PUT',
      params: {
        controller: 'password'
      }
    },
    get: {
      method: 'GET',
      params: {
        id: 'me'
      }
    },
    getTeamMates : {
        method:'GET',
        isArray: true,
        params: {
            controller:'teammates'
        }
    }

  });
}

angular.module('dealScanCrmApp.auth')
  .factory('User', UserResource);

})();
