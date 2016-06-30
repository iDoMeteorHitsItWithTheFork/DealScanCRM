/**
 * Created by ludovicagodio on 6/30/16.
 */
'use strict';

(function () {

  function SocialMediaResource($resource) {
    return $resource('/api/socialMedias/:id/:controller', {
        id: '@socialMediaId' //facebook, twitter
      },
      {
        twitterSearch: {
          method: 'GET',
          params: {
            id:'twitter',
            controller: 'search'
          }
        },
      });
  }

  angular.module('dealScanCrmApp')
    .factory('SocialMediaResource', SocialMediaResource);

})();
