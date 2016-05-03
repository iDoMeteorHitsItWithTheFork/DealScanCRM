/**
 * Created by ludovicagodio on 4/23/16.
 */
'use strict';

(function () {

  function ImageResource($resource) {
    return $resource('/api/images/:id/:controller', {
      id: '@imageID'
    }, {
      update: {
        method:'PUT',
      },
      upload :{
        method: 'POST',
        params: {
          controller:'upload'
        }
      }
    });
  }

  angular.module('dealScanCrmApp')
    .factory('ImageResource', ImageResource);

})();
