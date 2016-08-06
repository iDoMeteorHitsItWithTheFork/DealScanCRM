/**
 * Created by cary.gaskell on 8/6/16.
 */
angular.module('dealScanCrmApp')
    .controller('CreateWatchlistCtrl',['$scope', '$rootScope', '$timeout', '$compile', '$state', '$window', '$uibModal', '$uibModalInstance','$filter', function ($scope, $rootScope, $timeout, $compile, $state, $window, $uibModal, $uibModalInstance, $filter) {
      $( ".input" ).addClass( "form-control" );

      var _wl = this;

      _wl.saving = false;

      _wl.newWatchlist = {
        name: '',
        keywords: [],
        location: {name: '', lat: null, lng: null}
      }

      _wl.ok = function () {
        console.log(_wl.newWatchlist);
        $uibModalInstance.close(_wl.newWatchlist);
      };

      _wl.cancel = function () {
        $uibModalInstance.dismiss();
      };
      
      _wl.placeChanged = function() {
        var pl = this.getPlace();
        if (angular.isDefined(pl.geometry)){
          if (pl.geometry.location) {
             _wl.newWatchlist.location.lat = pl.geometry.location.lat();
              _wl.newWatchlist.location.lng = pl.geometry.location.lng();
          }
          _wl.newWatchlist.location.name = pl.formatted_address;
        } else {
          console.log("error on location select...");
        }
      };

      function parseLocationString(str){
        var rx = new RegExp(/^(\-?\d+(\.\d+)?),\s*(\-?\d+(\.\d+)?)$/);
        if (rx.test(str)) {
          coords = str.split(',',2);
          return {lat: parseFloat(coords[0]), lng: parseFloat(coords[1])};
        } return null;
      }

    }]);