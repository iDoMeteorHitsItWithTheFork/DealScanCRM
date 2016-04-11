/**
 * Created by ludovicagodio on 4/11/16.
 */
'use strict';

(function () {

  function NoteResource($resource) {
    return $resource('/api/notes/:id/:controller', {
      id: '@noteID'
    }, {
      update: {
        method:'PUT',
      },
    });
  }

  angular.module('dealScanCrmApp')
    .factory('NoteResource', NoteResource);

})();
