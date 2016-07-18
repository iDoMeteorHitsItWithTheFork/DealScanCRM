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
    getFilters : {
        method:'GET',
        isArray: true,
        params: {
            controller:'filters'
        }
    },
    getMetrics: {
      method: 'GET',
      isArray: true,
      params: {
        controller: 'metrics'
      }
    }

  });
}

angular.module('dealScanCrmApp.auth')
  .factory('User', UserResource);

})();
