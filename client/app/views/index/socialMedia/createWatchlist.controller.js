/**
 * Created by cary.gaskell on 8/6/16.
 */
angular.module('dealScanCrmApp')
    .controller('CreateWatchlistCtrl',
      function ($scope, Auth, $uibModalInstance, $filter, SocialMedia, toaster) {
      $( ".input" ).addClass( "form-control" );

      var _wl = this;
      _wl.user = Auth.getCurrentUser();
       console.log(_wl.user);
      _wl.saving = false;

      _wl.newWatchlist = {
        name: '',
        dealershipName: _wl.user.Employer[0].dealerInfo.name,
        keywords: [],
        location: {name: '', lat: null, lng: null}
      }

      _wl.ok = function () {
        if (_wl.saving) return;
        console.log(_wl.newWatchlist);
        var details = {};
        /* Watchlist Details */
        details.Watchlist = {
          WatchlistName: _wl.newWatchlist.name,
          DealershipName: _wl.newWatchlist.dealershipName,
          Location: _wl.newWatchlist.location
        };

        /* Keywords to Monitor */
        details.Keywords = [];
        for(var i=0; i < _wl.newWatchlist.keywords.length; i++)
          details.Keywords.push({keyword: _wl.newWatchlist.keywords[i].text});

        /* Sources to monitor */
        details.Sources = ['twitter'];
        console.log(details);



        _wl.saving = true;
        SocialMedia.create(details)
          .then(function(watchlist){
             if (watchlist){
               toaster.success({title: 'New Watchlist', body: 'The Watchlist ('+details.Watchlist.WatchlistName+') was successfully created!'});
               $uibModalInstance.close(watchlist);
             } else toaster.error({title: 'Watchlist Error', body:'An error occured while attempting to create your watchlist'});
            _wl.saving = false;
        }).catch(function(err){
           console.log(err);
           _wl.saving = false;
           toaster.error({title: 'Watchlist Error', body: 'An error while creating your watchlist'});
        });

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

    });
