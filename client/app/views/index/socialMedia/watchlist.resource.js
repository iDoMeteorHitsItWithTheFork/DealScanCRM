/**
 * Created by ludovicagodio on 7/4/16.
 */
'use strict';

(function () {

  function WatchlistResource($resource) {
    return $resource('/api/watchlists/:id/:controller', {
        id: '@watchlistID'
      }, {

    });
  }
  angular.module('dealScanCrmApp')
    .factory('WatchlistResource', WatchlistResource);

})();
