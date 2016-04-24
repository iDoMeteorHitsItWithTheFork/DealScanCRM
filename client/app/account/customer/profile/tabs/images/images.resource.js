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
    });
  }

  angular.module('dealScanCrmApp')
    .factory('ImageResource', ImageResource);

})();
