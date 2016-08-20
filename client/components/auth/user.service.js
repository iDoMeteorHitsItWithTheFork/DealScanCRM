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
    getDealers: {
      method: 'GET',
      isArray: true,
      params: {
        id: 'dealers'
      }
    },
    getFilters : {
        method:'GET',
        isArray: true,
        params: {
            controller:'filters'
        }
    },

  });
}

angular.module('dealScanCrmApp.auth')
  .factory('User', UserResource);

})();
