/**
 * Created by ludovicagodio on 7/6/16.
 */
'use strict';

angular.module('dealScanCrmApp')
  .factory('SocialMediaMonitoring', function (socket, $q, $timeout, $interval, Util) {

      var deferred = $q.defer();
      var STATE_DISCONNECTED = 'disconnected';
      var STATE_DISCONNECTED_DUE_TO_INACTIVITY = 'disconnected-due-to-inactivity';
      var STATE_CONNECTED = 'connected';

      var lastTweetsMaxlength = 10;


      var _socket = socket.socket;

      var _data = {
        count: 0,
        channels: {},
        keywords: {},
        channelsDescription: []
      };



      var _state = {
        socket: null,
        socketTimeout: 0,
        twitter: STATE_CONNECTED,
        connexionTime : {
          connected : false,
          previousTimeElapsed : 0,
          currentStartTime : 0
        }
      };
      var _socketMaxAgeInfos = {
        socketMaxAge : null,
        socketMaxAgeAlertBefore : null
      };
      var timer = null;

      var prepareSocketTimeout = function(socketMaxAge,socketMaxAgeAlertBefore){
        if(timer !== null){
          $timeout.cancel(timer);
        }
        var timeout = socketMaxAge - socketMaxAgeAlertBefore;
        timer = $timeout(function(){
          _state.socketTimeout++;
        },timeout);
      };

      var updateStateConnexionTime = function(){
        if( (_state.twitter !== STATE_CONNECTED || _state.socket !== STATE_CONNECTED) && _state.connexionTime.connected === true){
          _state.connexionTime.connected = false;
          _state.connexionTime.previousTimeElapsed = _state.connexionTime.previousTimeElapsed + (new Date()).getTime() - _state.connexionTime.currentStartTime;
          console.log('updateStateConnexionTime - disconnect',_state);
        }
        else if( (_state.twitter === STATE_CONNECTED && _state.socket === STATE_CONNECTED) && _state.connexionTime.connected === false){
          _state.connexionTime.connected = true;
          _state.connexionTime.currentStartTime = (new Date()).getTime();
          console.log('updateStateConnexionTime - connect',_state);
        }
      };

      //once the client connected
      _socket.on('connected', function(msg) {
        console.log('connected', msg);
        deferred.resolve('init');
        _data.channelsDescription = msg.channelsDescription;
        _initData();
        _state.socket = STATE_CONNECTED;
        _state.twitter = msg.twitterState;
        // _socketMaxAgeInfos.socketMaxAge = msg.socketMaxAge;
        // _socketMaxAgeInfos.socketMaxAgeAlertBefore = msg.socketMaxAgeAlertBefore;
        // prepareSocketTimeout(msg.socketMaxAge,msg.socketMaxAgeAlertBefore);
        // updateStateConnexionTime();
      });

      //if the client looses the socket connection to the server
      _socket.on('disconnect', function(msg) {
        console.log('disconnect', msg);
        _state.socket = STATE_DISCONNECTED;
        //_state.twitter = STATE_DISCONNECTED;
        updateStateConnexionTime();
      });

      //event emitted from the server when a client has been inactive too long
      _socket.on('inactive-socket', function(msg) {
        console.warn(msg.msg, "Inactive for " + msg.timeout + "ms");
        _socket.disconnect();
        _state.socket = STATE_DISCONNECTED_DUE_TO_INACTIVITY;
        //_state.twitter = STATE_DISCONNECTED;
        updateStateConnexionTime();
      });

      //events to keep track of the state of the twitter stream on the server behing the websocket
      _socket.on('twitter:connect', function(msg) {
        console.log('twitter:connect', msg);
        _state.twitter = msg.twitterState;
        updateStateConnexionTime();
      });
      _socket.on('twitter:connected', function(msg) {
        console.log('twitter:connected', msg);
        _state.twitter = msg.twitterState;
        updateStateConnexionTime();
      });
      _socket.on('twitter:disconnect', function(msg) {
        console.log('twitter:disconnect', msg);
        _state.twitter = msg.twitterState;
        updateStateConnexionTime();
      });

      //update on each postprocessed tweet
      _socket.on('data', function(msg) {
        var channelId, i, keyword;
//            console.log(msg.text);
        //feed channels infos
        for (channelId in msg.$channels) {
          _data.channels[channelId].count++;
          _data.channels[channelId].lastTweets = [msg].concat(_data.channels[channelId].lastTweets);
          if (_data.channels[channelId].lastTweets.length > lastTweetsMaxlength) {
            _data.channels[channelId].lastTweets.pop();
          }
          _formattedData[channelId].data = [{
            datasource: 'twitter',
            username: msg.tweet.user.screen_name,
            avatar: msg.tweet.user.profile_image_url,
            posterID: msg.tweet.user.id_str,
            postID: msg.tweet.id_str,
            text: msg.tweet.text,
            image: msg.tweet.entities.media ? msg.tweet.entities.media[0].media_url : null,
            created_at: moment(msg.tweet.created_at),
            time_ago: moment(msg.tweet.created_at).fromNow(),
            geo: msg.tweet.coordinates ? [msg.tweet.coordinates.coordinates[1],msg.tweet.coordinates.coordinates[0]]: null, //FYI: coordinates is formatted in geoJSON [longitude, latitude]
            counts: {
              share_count: msg.tweet.retweet_count,
              like_count: msg.tweet.favorite_count,
              comment_count: null
            },
            comments: null,
            retweeted: msg.tweet.retweeted,
            favorited: msg.tweet.favorited
          }].concat(_formattedData[channelId].data);
          if (_formattedData[channelId].data.length > lastTweetsMaxlength){
            _formattedData[channelId].data.pop();
          }

          for (i = 0; i < msg.$channels[channelId].length; i++) {
            if (typeof _data.channels[channelId].keywords[msg.$channels[channelId][i]] === 'undefined') {
              _data.channels[channelId].keywords[msg.$channels[channelId][i]] = {
                count: 0,
                name: msg.$channels[channelId][i]
              };
            }
            var idx = Util.indexOfObject(_formattedData[channelId].Keywords, 'keyword', msg.$channels[channelId][i]);
            if (idx != -1) _formattedData[channelId].Keywords[idx].count++;
            _data.channels[channelId].keywords[msg.$channels[channelId][i]].count++;
          }
        }
        for (i = 0; i < msg.$keywords.length; i++) {
          if (typeof _data.keywords[msg.$keywords[i]] === 'undefined') {
            _data.keywords[msg.$keywords[i]] = {
              count: 0,
              name: _data.keywords[msg.$keywords[i]]
            };
          }
          _data.keywords[msg.$keywords[i]].count++;
        }
        _data.count++;
      });

      var _formattedData = [];

      var _initData = function() {
        var channelId;
        for (channelId in _data.channelsDescription) {
          _data.channels[channelId] = {
            lastTweets: [],
            keywords: {},
            count: 0
          };
           /* Initialize formatted data */
          _formattedData.push({
            watchlistName: _data.channelsDescription[channelId].title,
            watchlistDescription: _data.channelsDescription[channelId].description,
            Keywords: _data.channelsDescription[channelId].track,
            data: []
          })
        }

        for(var i = 0; i < _formattedData.length; i++){
          var reformattedArray = _formattedData[i].Keywords.map(function(obj){
            var rObj = {keyword : obj, count: 0};
            return rObj;
          });
          _formattedData[i].Keywords = reformattedArray;
        }
      };

      var getData = function() {
        return _data;
      };

      var getFormattedData  = function(){
        return _formattedData;
      }

      var getState = function() {
        console.log('getState',_state,_state.twitter,_state.socket);
        return _state || {};
      };

      var getSocket = function() {
        return _socket;
      };

      var getSocketMaxAgeInfos = function(){
        return _socketMaxAgeInfos;
      };

      // var extendConnexion = function(){
      //   _socket.emit('extend-connexion');
      //   console.log('extend-connexion');
      //   prepareSocketTimeout(_socketMaxAgeInfos.socketMaxAge,_socketMaxAgeInfos.socketMaxAgeAlertBefore);
      // };

      /**
       * Returns a promise to use in a route resolver to be sure not to launch some controllers that should have socket connection init before their creation
       * @returns {$q.promise}
       */
      var isInit = function() {
        return deferred.promise;
      };


       var startMonitoring = function(){
         _socket.emit('startMonitoring');
          return getFormattedData();
       }

       var stopMonitoring = function(){
         _socket.emit('stopMonitoring');
          return getFormattedData();
       }

      //public API

      return {
        getSocket: getSocket,
        getData: getData,
        getState: getState,
        getSocketMaxAgeInfos : getSocketMaxAgeInfos,
        isInit: isInit,
        start: startMonitoring,
        stop: stopMonitoring
        // extendConnexion : extendConnexion,
        // _debug: {
        //   state: {
        //     switchSocketState: function() {
        //       if (_state.socket === STATE_CONNECTED) {
        //         _state.socket = STATE_DISCONNECTED;
        //       }
        //       else {
        //         _state.socket = STATE_CONNECTED;
        //       }
        //     },
        //     inactiveSocket: function() {
        //       _state.socket = STATE_DISCONNECTED_DUE_TO_INACTIVITY;
        //     },
        //     switchTwitterState: function() {
        //       if (_state.twitter === STATE_CONNECTED) {
        //         _state.twitter = STATE_DISCONNECTED;
        //       }
        //       else {
        //         _state.twitter = STATE_CONNECTED;
        //       }
        //     }
        //   }
        // }
      };

    });
