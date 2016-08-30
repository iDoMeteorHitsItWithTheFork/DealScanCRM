'use strict';

angular.module('dealScanCrmApp')
  .controller('SocialMediaCtrl', function ($scope, $timeout, Auth, Util, $filter, $aside, SocialMedia, NgMap, $q, toaster, $uibModal) {
    $("#page-wrapper").css("overflow-x", "hidden");//little hack for scroll issue

    var _sm =this;
    _sm.user = Auth.getCurrentUser();
    _sm.searchResults = SocialMedia.searchResults();
    _sm.watchlists = SocialMedia.watchlists();
    _sm.stream = {};
    _sm.mapCenter = [39.628, -77.766];
    _sm.views  = [{id:'discover', name:'Social Media Discovery', active: true},
                  {id: 'monitor', name: 'Social Media Monitoring', active: false}];

    _sm.currentView = _sm.views[0];

    _sm.setCurrentView = function(id){
       console.log('setting view with id: '+id);
       var idx = Util.indexOfObject(_sm.views, 'id', id);
       console.log('Idx: '+idx);
       if (idx != -1) {
         _sm.currentView = _sm.views[idx];
         _sm.views[idx].active = true;
         for (var i = 0; i < _sm.views.length; i++)
           if (id != _sm.views[i].id)
             _sm.views[i].active = false;
       }
    }

    _sm.searchObj = {text: (_sm.searchResults.searchParams) ?_sm.searchResults.searchParams.q : null,
                    geo: {lat: null, lon: null, distance: null},
                    sources: [{id: 'twt', name: 'twitter', selected: true, iconStyle: 'margin-left: -2px;', buttonStyle:''},
                              {id: 'fb', name: 'facebook', selected: false, iconStyle: '', buttonStyle: 'margin-right:0;'}]};

    _sm.monitorList = [{text: '#hagerstownford', count: 0}, {text: '#FordFocus', count: 5}, {text: '#DealScan', count: 50}];
    _sm.sources = [{name: 'All'}, {name: 'Twitter'}, {name: 'Facebook'}];

    _sm.tags = [
      { text: '#hagerstownford' },
      { text: '#FordFocus' },
      { text: '#DealScan' }
    ];
    var infoWindow = null;
    _sm.newText = {text: ''};

    _sm.lists = [{title: 'Luda List'}, {title: 'Cary List'}, {title: 'Another list'}];

    _sm.addToList = function (){
      var newObj = _sm.newText;
      _sm.tags.push(newObj);
    }

    _sm.removeFromList = function (obj){
      var index = _sm.tags.indexOf(obj);
      if (index > -1) {
        _sm.tags.splice(index, 1);
      }
    }

    _sm.monitorButtons = [{id: 'twt', name: 'twitter', selected: true, iconStyle: 'margin-left: -2px;', buttonStyle:''},
      {id: 'fb', name: 'facebook', selected: false, iconStyle: '', buttonStyle: 'margin-right:0;'}]

    _sm.missingAvatar = 'assets/images/img-profile-missing.png';

    _sm.drawing = false;

      NgMap.getMap().then(function (map) {
        _sm.drawingManager = new google.maps.drawing.DrawingManager({
          drawingControl: true,
          drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
              google.maps.drawing.OverlayType.CIRCLE,
            ]
          },
          circleOptions: {
            fillColor: '#c6ccd7',
            strokeColor: '#41577c',
            strokeWeight: 2,
            strokeOpacity: 0.8,
            clickable: false,
            editable: true,
            zIndex: 1
          }
        });

        _sm.drawingManager.setOptions({
          drawingControl: false
        });
        _sm.drawingManager.setMap(map);
        _sm.map = map;
      });

    _sm.clearResults = function () {
      console.log("clearing results...");
      _sm.searchResults.data.length = 0;
      if (infoWindow){
        infoWindow.close();
      }
    }

    _sm.removeCircle = function () {
      if (_sm.shape){
        _sm.shape.setMap(null);
        _sm.shape = null;
        _sm.drawing = false;
      }
      _sm.searchObj.geo = {lat: null, lon: null, distance: null};


    }

    _sm.setLocation = function (){
      if (_sm.drawing === true){
        _sm.drawing = false;
        return;
      }
      if (_sm.shape){
        _sm.shape.setMap(null);
      }

      _sm.drawing = true;
      _sm.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.CIRCLE);
      google.maps.event.addListener(_sm.drawingManager, 'circlecomplete', function(circle) {
        _sm.drawingManager.setDrawingMode(null);
        _sm.shape = circle;
        google.maps.event.addListener(_sm.shape, 'radius_changed', function(){
          $scope.$applyAsync(function(){
            _sm.searchObj.geo.distance = _sm.shape.radius;
          });
        })
        google.maps.event.addListener(_sm.shape, 'center_changed', function(){
          $scope.$applyAsync(function(){
            _sm.searchObj.geo.lat = _sm.shape.getCenter().lat();
            _sm.searchObj.geo.lon = _sm.shape.getCenter().lng();
          });
        });
        $scope.$applyAsync(function(){
          _sm.drawing = false;
          setCircleDetails(circle);
        });
      });
    }

    var setCircleDetails = function(circle){
      if(circle){
        _sm.searchObj.geo.lat = circle.getCenter().lat();
        _sm.searchObj.geo.lon = circle.getCenter().lng();
        _sm.searchObj.geo.distance = circle.getRadius();
      }
    }

    /**
     * Refresh Map on hide and show
     * @param map
     */
    _sm.refreshMap = function (map) {
      $scope.$applyAsync(function(){
        var m = map ? map : _sm.map;
        if (m) {
          console.log(m);
          google.maps.event.trigger(m, 'resize');
          console.log('*** Refreshed Map ***');
        }
      });


    };

    _sm.refreshMap();

    _sm.broadcast = function(){
      var asideInstance = $aside.open({
        templateUrl: 'app/views/index/socialMedia/socialMedia.broadcast.html',
        controller: 'SocialMediaBroadcastCtrl as smBroadcast',
        placement: 'right',
        size:'300',
        resolve: {
          loadPlugin: function ($ocLazyLoad) {
            return $ocLazyLoad.load([
              {
                files: ['.styles/plugins/iCheck/custom.css','.resources/plugins/iCheck/icheck.min.js']
              }
            ]);
          }
        }
      });
    }

     /* Trim And Normalize Image Url */
    _sm.trimImgUrl = function(url){
       return Util.trimImgUrl(url);
    }
    /* Time Ago */
    _sm.momentAgo = function(time){
        return moment(time).fromNow();
    }
    //search media
    _sm.searchSocialMedia = function(bounds, next){
      if (!bounds) bounds = 'circle';
      console.log(_sm.searchObj);
      var searchOptions = {};
      // if (polySearch) location.poly = poly;
      if (_sm.searchObj.geo.lat == null &&
        _sm.searchObj.geo.lon == null &&
        _sm.searchObj.geo.distance == null &&
        (!_sm.searchObj.text || _sm.searchObj.text.trim() == '')) return;
      if (_sm.searchObj.text && _sm.searchObj.text.trim().length > 0) searchOptions.term = _sm.searchObj.text;
      if (_sm.searchObj.geo.lat && _sm.searchObj.geo.lon  && _sm.searchObj.geo.distance ) {
        searchOptions.location = _sm.searchObj.geo;
        searchOptions.location.distance = searchOptions.location.distance;
        searchOptions.location.metrics = 'km';
      }
      if (_sm.searchObj.geo.lat && _sm.searchObj.geo.lon) searchOptions.bounds = bounds;
      _sm.searchLoading = true;
      searchOptions.sources = _sm.searchObj.sources;
      console.log(searchOptions);
      SocialMedia.search(searchOptions, next)
        .then(function (res) {
          console.log(res);
          _sm.searchResults = res;
          _sm.searchLoading = false;
        }).catch(function (err) {
        console.log(err);
        toaster.error({title: 'Social Media Error', body: err});
        _sm.searchLoading = false;
      });
    }

    _sm.showInfoWindow = function(event, post, map, center, scrollOption){

      var username = post.username;
      var time_ago = post.time_ago;
      var text = post.text;
      var img = post.image;

      if (post.avatar === null) {
        var avatar = _sm.missingAvatar;
      } else {
        var avatar = post.avatar;
      }

      if (center) map.setCenter(new google.maps.LatLng(post.geo[0], post.geo[1]));

      if (img === null){
        var content = "<div class='info-window'>" +
            "<a href='http://google.com' target='_blank'></a>" +
            "<ul class='info-list'>" +
            "<li><img class='avatar img-circle' src='"+avatar+"' alt=''/><a class='user_name'>@"+username+"</a></li>" +
            "<li>"+text+"</li>" +
            "<i class='fa fa-clock-o'></i>&nbsp;&nbsp;"+time_ago+
            "<li><i class='fa fa-map-marker'></i>&nbsp;&nbsp;"+post.geo[0]+","+post.geo[1]+" </li></ul></div>";
      } else {
        var content = "<div class='info-window'>" +
            "<a href='http://google.com' target='_blank'></a>" +
            "<ul class='info-list'>" +
            "<li><img class='avatar img-circle' src='"+avatar+"' alt=''/><a class='user_name'>@"+username+"</a></li>" +
            "<li>"+text+"</li>" +
            "<i class='fa fa-clock-o'></i>&nbsp;&nbsp;"+time_ago+
            "<li><img class='img-responsive' src='"+image+"' alt=''/></li>" +
            "<li><i class='fa fa-map-marker'></i>&nbsp;&nbsp;"+post.geo[0]+","+post.geo[1]+" </li></ul></div>";
      }

      if (infoWindow === null){
        infoWindow = new google.maps.InfoWindow({
          content: content,
          position: new google.maps.LatLng(post.geo[0], post.geo[1]),
          pixelOffset: new google.maps.Size(-2, -37),
        });
      } else {
        infoWindow.setContent(content);
        infoWindow.setPosition(new google.maps.LatLng(post.geo[0], post.geo[1]));
      }
     // <img class='img-responsive' src="+md+" alt=''/>


      infoWindow.open(map);

      google.maps.event.addListener(infoWindow,'closeclick',function(){});

    }

    $timeout(function(){
      //_sm.map.setCenter(new google.maps.LatLng(_location.lat, _location.lng));
      google.maps.event.trigger(_sm.map,'resize');
      console.log("resizing...");
    }, 2000);
      /**
       * Like or Favs a Post depending on Source
       * @param post
       */
    _sm.likeOrFavs = function(post){
        if (!post) return;
        switch(post.datasource){
          case 'facebook':
            likePost(post);
            break;
          case 'twitter':
            favoritedTweet(post);
            break;
        }
    }

      /**
       * like a facebook post
       * @param post
       */
    function likePost(post){
      if (post.processing) return;
      post.processing = true;
      SocialMedia.like(post).then(function(res){
        post.processing = false;
        delete post.processing;
        if (res.errorCode) {

          //display error cod
        } else post = res;
      }).catch(function(err){
        post.processing = false;
        delete post.processing;
        console.log(err);
        toaster.error({title:'Facebook Like Error', body: err});
      });
    }

      /**
       * Comment or Reply to Post
       * @param post
       */
    _sm.commentOrReply = function(post, form){
      if (!post || !post.new_message || !form) return;
      switch(post.datasource){
        case 'facebook':
          commentOnPost(post, form);
          break;
        case 'twitter':
          break;
      }
    }

    /**
     * Add comment to facebook post
     * @param post
     * @param message
       */
     function commentOnPost(post, form){
      if (post.processingMsg) return;
      post.processingMsg = true;
      SocialMedia.comment(post).then(function(res){
        post.processingMsg = false;
        delete post.processingMsg;
        if (res.errorCode) {
          //display error cod
        } else {
          post = res;
          post.new_message = '';
          form.$setPristine();
        }
      }).catch(function(err){
        post.processing = false;
        delete post.processingMsg;
        console.log(err);
        toaster.error({title:'Facebook Comment Error', body: err});
      });

    }


    /**
     * Retweet a post
     * @param post
       */
    function reTweet(post){
      if (!post || !post.postID || post.retweeted) return;
      if (post.retweeting) return;
      post.retweeting = true;
      SocialMedia.reTweet(post).then(function(res){
        console.log(res);
        post.retweeting = false;
        delete post.retweeting;
        if (res && !res.errorCode){
           post = res;
        } else {
          toaster.error({title:'Twitter ReTweet Error ('+res.errorCode+')', body: res.errorMessage});
        }
      }).catch(function(err){
          delete post.retweeting
          console.log(err);
          toaster.error({title:'Twitter ReTweet Error', body: err});
      });
    }

    function favoritedTweet(post){
      if (!post || !post.postID || post.favorited) return;
      if (post.processing) return;
      post.processing = true;
      SocialMedia.favs(post).then(function(res){
        console.log(res);
        post.processing = false;
        delete post.processing;
        if (res && !res.errorCode){
          post = res;
        } else {
          toaster.error({title:'Twitter Favs Error ('+res.errorCode+')', body: res.errorMessage});
        }
      }).catch(function(err){
        delete post.processing
        console.log(err);
        toaster.error({title:'Twitter Favs Error', body: err});
      });
    }

    /**
     * Share or Retweet a Post
     * @param post
       */
    _sm.shareOrRetweet = function(post){
        if (!post) return;
        switch(post.datasource){
          case 'twitter':
            reTweet(post);
            break;
          case 'facebook':
            break;
        }
    }


    _sm.controls = function(){
      _sm.displayingList.paused = !_sm.displayingList.paused;
      (_sm.displayingList.paused) ? _sm.startMonitoring() : _sm.stopMonitoring();
    }

    _sm.startMonitoring = function(){
       if (_sm.intiatingStream) return;
       console.log(_sm.watchlists);
       console.log('[Starting Monitoring]');
       _sm.intiatingStream = true;
       _sm.stream = SocialMedia.monitor();

         /*var keys = Object.keys(_sm.stream);
         console.log(keys);
         for(var i = 0; i < keys.length; i++){
           var idx = Util.indexOfObject(_sm.watchlists, 'watchlistName', keys[i]);
           if (idx != -1){
             console.log('\n\n\n STREAM[Keys[i]] \n\n');
             console.log(keys[i]);
             console.log(_sm.stream[keys[i]]);
             console.log('\n\n\n ----------------- \n\n');
             _sm.watchlists[idx].data = _sm.stream[keys[i]].data;
             for(var k = 0; k < _sm.watchlists[idx].Keywords.length; k++){
               var _keyword = _sm.watchlists[idx].Keywords[k];
               _keyword.count = _sm.stream[keys[i]].keywords[_keyword.keyword.toLowerCase()];
             }
           }
         }*/

    }


    _sm.stopMonitoring  = function(){
       console.log('[Stoping Monitoring]');
       SocialMedia.stopStream();
    }


      /**
       * Twitter status update
       * @param message
       */
     _sm.tweet = function(message){
        if (!message) return;
        SocialMedia.tweet(message).then(function(res){
           if (res && res.success){
              toaster.success({title:'Twitter Status Update', body: res.message});
           } else toaster.error({title: 'Twitter Status Update', body: 'Unable to post status update'});
        }).catch(function(err){
           console.log(err);
           toaster.error({title: 'Twiiter Status Update', body: err});
        });
     }

    _sm.createWatchlist = function () {
      var modalInstance = $uibModal.open({
        animation: true,
        windowClass: 'slide-up',
        templateUrl: 'app/views/index/socialMedia/createWatchlist.html',
        controller: 'CreateWatchlistCtrl as wl',
        resolve: {
          loadPlugin: function ($ocLazyLoad) {
            return $ocLazyLoad.load([
              {
                serie: true,
                name: 'angular-ladda',
                files: ['.resources/plugins/ladda/spin.min.js', '.resources/plugins/ladda/ladda.min.js',
                  '.styles/plugins/ladda/ladda-themeless.min.css','.resources/plugins/ladda/angular-ladda.min.js']
              },
              {
                name: 'datePicker',
                files: ['.styles/plugins/datapicker/angular-datapicker.css','.resources/plugins/datapicker/angular-datepicker.js']
              },
              {
                serie: true,
                files: ['.resources/plugins/daterangepicker/daterangepicker.js', '.styles/plugins/daterangepicker/daterangepicker-bs3.css']
              },
              {
                name: 'daterangepicker',
                files: ['.resources/plugins/daterangepicker/angular-daterangepicker.js']
              },
            ]);
          }
        }
      });




    }

    _sm.placeChanged = function() {
      var pl = this.getPlace();
      if (angular.isDefined(pl.geometry)){
        if (pl.geometry.location) {
          _sm.mapCenter[0] = pl.geometry.location.lat();
          _sm.mapCenter[1] = pl.geometry.location.lng();
        }
      } else {
        console.log("error on location select...");
      }
    };

  });
