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
        likeTweet: {
          method: 'POST',
          params: {
            id:'twitter',
            controller: 'like'
          }
        },
        reTweet: {
          method: 'POST',
          params: {
            id:'twitter',
            controller: 'reTweet'
          }
        },
        setFbToken: {
          method: 'PUT',
          params: {
            id: 'facebook',
            controller: 'setToken'
          }
        },
        facebookSearch: {
          method: 'GET',
          // isArray: true,
          params: {
            id:'facebook',
            controller: 'search'
          }
        },
      });
  }

  angular.module('dealScanCrmApp')
    .factory('SocialMediaResource', SocialMediaResource);

})();
