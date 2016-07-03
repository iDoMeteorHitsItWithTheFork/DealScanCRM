'use strict';

angular.module('dealScanCrmApp')
  .controller('SocialMediaCtrl', function ($scope, Auth, Util, $filter, $aside, SocialMedia, NgMap, $q) {
    $("#page-wrapper").css("overflow-x", "hidden");//little hack for scroll issue

    var _sm =this;
    _sm.user = Auth.getCurrentUser();
    _sm.searchResults = SocialMedia.searchResults();

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

    _sm.searchObj = {text: _sm.searchResults.searchParams.q, radius: null, geo: {lat: null, lng: null},
                    sources: [{id: 'twt', name: 'twitter', selected: true, iconStyle: 'margin-left: -2px;', buttonStyle:''},
                              {id: 'fb', name: 'facebook', selected: false, iconStyle: '', buttonStyle: 'margin-right:0;'}]};

    _sm.monitorList = [{text: '#hagerstownford', count: 0}, {text: '#FordFocus', count: 5}, {text: '#DealScan', count: 50}];

    _sm.monitorButtons = [{id: 'twt', name: 'twitter', selected: true, iconStyle: 'margin-left: -2px;', buttonStyle:''},
      {id: 'fb', name: 'facebook', selected: false, iconStyle: '', buttonStyle: 'margin-right:0;'}]

    _sm.missingAvatar = 'http://www.marineinsurance-ircm.co.uk/wp-content/uploads/2015/12/img-profile-missing.png';

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
        _sm.shapes[1].shape = circle;
        google.maps.event.addListener(_sm.shapes[1].shape, 'radius_changed', function(){
          $scope.$applyAsync(function(){
            _sm.searchObj.radius = _sm.shapes[1].shape.radius;
          });
        })
        google.maps.event.addListener(_location.shapes[1].shape, 'center_changed', function(){
          $scope.$applyAsync(function(){
            _sm.searchObj.geo.lat = _sm.shapes[1].shape.getCenter().lat();
            _sm.searchObj.geo.lng = _sm.shapes[1].shape.getCenter().lng();
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
        _sm.searchObj.geo.lng = circle.getCenter().lng();
        _sm.searchObj.radius = circle.getRadius();
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
      })
    }

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
      console.log(_sm.searchObj);
        var searchOptions = {};
        var location = null;
        //location = {lat: '38.95606601970584', lon: '-77.03687070000001', distance: '4', metrics: 'mi'};
        // if (polySearch) location.poly = poly;
        if (location == null  && (!_sm.searchObj.text || _sm.searchObj.text.trim() == '')) return;
        if (_sm.searchObj.text && _sm.searchObj.text.trim().length > 0) searchOptions.term = _sm.searchObj.text;
        if (location) searchOptions.location = location;
        if (location) searchOptions.bounds = bounds;
        _sm.searchLoading = true;
        searchOptions.sources = _sm.searchObj.sources;
        SocialMedia.search(searchOptions, next).then(function(res){
          console.log(res);
          _sm.searchResults = res;
          _sm.searchLoading = false;
        }).catch(function(err){
            console.log(err);
            _sm.searchLoading = false;
      });
    }




  });
