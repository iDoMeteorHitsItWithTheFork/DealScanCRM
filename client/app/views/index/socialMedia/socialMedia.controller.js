'use strict';

angular.module('dealScanCrmApp')
  .controller('SocialMediaCtrl', function ($scope, Auth, Util, $filter, $aside, SocialMedia, NgMap, $q, toaster) {
    $("#page-wrapper").css("overflow-x", "hidden");//little hack for scroll issue

    var _sm =this;
    _sm.user = Auth.getCurrentUser();
    _sm.searchResults = SocialMedia.searchResults();
    _sm.watchlists = SocialMedia.watchlists();

    console.log(_sm.watchlists);


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


    _sm.setLocation = function (){
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
        size:'sm',
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
        searchOptions.location.distance = Math.ceil(searchOptions.location.distance /1000);
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

    _sm.startMonitoring = function(){
      var keywords = ['Donald','Trump', 'Clinton', 'big booty judy'];
      SocialMedia.monitor(keywords).then(function(res){
         console.log(res);
      }).catch(function(err){
          console.log(err);
          toaster.error({title:'Social Monitor Error',  body: err});
      })
    }

    _sm.startMonitoring();

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



    _sm.watchlists = [
      {
        watchlistID: 1,
        watchlistName: 'Online Reputation Management',
        Dealership: {
          dealershipID: 1,
          dealershipName: 'Hagerstown Ford',
        },
        ListOwner: {
          OwnerID: 1,
          email: 'ecarper@hagestownford.com',
          role: 'General Manager',
          name: 'Eric Carper'
        },
        Keywords: [
          {
            keywordID: 1,
            keyword: '#HagerstownSmells',
            fb: true,
            twt: true
          },
          {
            keywordID: 2,
            keyword: '#tbt',
            fb: false,
            twt: true
          },
          {
            keywordID: 3,
            keyword: '@hagerstownford',
            fb: true,
            twt: true
          },
          {
            keywordID: 4,
            keyword: '#FacebookBlows',
            fb: true,
            twt: true
          },
          {
            keywordID: 5,
            keyword: '#NoBama',
            fb: false,
            twt: true
          },
          {
            keywordID: 5,
            keyword: '#CaryIsMyFavorite',
            fb: false,
            twt: true
          }
        ],
        Sources: [
          {
            sourceID: 1,
            source: 'facebook',
            id: 'fb',
            selected: false
          },
          {
            sourceID: 2,
            source: 'twitter',
            id: 'twt',
            selected: true
          },
        ],
        data: [
          {
            datasource: 'twitter',
            username: 'cary lee',
            avatar: 'https://scontent.xx.fbcdn.net/v/t1.0-1/c496.2.459.459/s50x50/10366210_790301567669756_6077979188230928059_n.jpg?oh=d8fdccd1c58cb15fa143dbe7b98bc39e&oe=57FADEE6',
            text: 'The post content goes here',
            image: null,
            created_at: 'timestamp or date string whichever you want',
            time_ago: '3 days ago',
            geo: { // if empty then null
              lat: 34.4,
              lng: 40.0
            },
            counts: {
              share_count: 0, //retweet count / share count for facebook
              like_count: 10,
              comment_count: 5
            },
            comments: null
          },
          {
            datasource: 'twitter',
            username: 'cary lee',
            avatar: 'https://scontent.xx.fbcdn.net/v/t1.0-1/c496.2.459.459/s50x50/10366210_790301567669756_6077979188230928059_n.jpg?oh=d8fdccd1c58cb15fa143dbe7b98bc39e&oe=57FADEE6',
            text: 'The post content goes here',
            image: null,
            created_at: 'timestamp or date string whichever you want',
            time_ago: '3 days ago',
            geo: { // if empty then null
              lat: 34.4,
              lng: 40.0
            },
            counts: {
              share_count: 0, //retweet count / share count for facebook
              like_count: 10,
              comment_count: 5
            },
            comments: null
          }
      ]
      },
      {
        watchlistID: 2,
        watchlistName: 'Luda list',
        Dealership: {
          dealershipID: 1,
          dealershipName: 'Hagerstown Ford',
        },
        ListOwner: {
          OwnerID: 2,
          email: 'ecarper@hagestownford.com',
          role: 'Engineer',
          name: 'Luda'
        },
        Keywords: [
          {
            keywordID: 1,
            keyword: 'HagersTown',
            fb: false,
            twt: true
          },
          {
            keywordID: 2,
            keyword: '#FordFocus',
            fb: true,
            twt: true
          },
          {
            keywordID: 3,
            keyword: '#NodeRocks',
            fb: false,
            twt: true
          },
          {
            keywordID: 4,
            keyword: '#FacebookSucks',
            fb: true,
            twt: true
          }
        ],
        Sources: [
          {
            sourceID: 1,
            source: 'facebook',
            id: 'fb',
            selected: false
          },
          {
            sourceID: 2,
            source: 'twitter',
            id: 'twt',
            selected: true
          },
        ],
        data:
          [
          {
            datasource: 'twitter',
            username: 'cary lee',
            avatar: 'https://scontent.xx.fbcdn.net/v/t1.0-1/c496.2.459.459/s50x50/10366210_790301567669756_6077979188230928059_n.jpg?oh=d8fdccd1c58cb15fa143dbe7b98bc39e&oe=57FADEE6',
            text: 'The post content goes here',
            image: null,
            created_at: 'timestamp or date string whichever you want',
            time_ago: '3 days ago',
            geo: { // if empty then null
              lat: 34.4,
              lng: 40.0
            },
            counts: {
              share_count: 0, //retweet count / share count for facebook
              like_count: 10,
              comment_count: 5
            },
            comments: null
          },
            {
              datasource: 'twitter',
              username: 'cary lee',
              avatar: 'https://scontent.xx.fbcdn.net/v/t1.0-1/c496.2.459.459/s50x50/10366210_790301567669756_6077979188230928059_n.jpg?oh=d8fdccd1c58cb15fa143dbe7b98bc39e&oe=57FADEE6',
              text: 'The post content goes here',
              image: null,
              created_at: 'timestamp or date string whichever you want',
              time_ago: '3 days ago',
              geo: { // if empty then null
                lat: 34.4,
                lng: 40.0
              },
              counts: {
                share_count: 0, //retweet count / share count for facebook
                like_count: 10,
                comment_count: 5
              },
              comments: null
            },
            {
              datasource: 'twitter',
              username: 'cary lee',
              avatar: 'https://scontent.xx.fbcdn.net/v/t1.0-1/c496.2.459.459/s50x50/10366210_790301567669756_6077979188230928059_n.jpg?oh=d8fdccd1c58cb15fa143dbe7b98bc39e&oe=57FADEE6',
              text: 'The post content goes here',
              image: null,
              created_at: 'timestamp or date string whichever you want',
              time_ago: '3 days ago',
              geo: { // if empty then null
                lat: 34.4,
                lng: 40.0
              },
              counts: {
                share_count: 0, //retweet count / share count for facebook
                like_count: 10,
                comment_count: 5
              },
              comments: null
            },
            {
              datasource: 'twitter',
              username: 'cary lee',
              avatar: 'http://pbs.twimg.com/profile_images/746012543928438784/DCKjkmgx_normal.jpg',
              text: 'The post content goes here',
              image: 'http://pbs.twimg.com/media/CmmKLkWWAAAiS0a.jpg', //if empty null
              created_at: 'timestamp or date string whichever you want',
              time_ago: '3 days ago',
              geo: { // if empty then null
                lat: 34.4,
                lng: 40.0
              },
              counts: {
                share_count: 0, //retweet count / share count for facebook
                like_count: 10,
                comment_count: 5
              },
              comments: null
            }
              ]

      }
    ];

  });
