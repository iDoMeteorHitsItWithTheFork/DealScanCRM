
var SocialStream = function(socket, StreamManager){

  var STATE_DISCONNECTED = 'disconnected';
  var STATE_CONNECTING = 'connecting';
  var STATE_CONNECTED = 'connected';

  var _stream = null;
  var stream_started_on = null;
  var twitterStreamRunning = false;//if true a stream to twitter is either connected or connecting
  var launchStreamRunning = false;//if true the launching routine is running (not to launch it it parallel)
  var cleanSocketsTimer = null;
  var twitterState = STATE_DISCONNECTED;



  /* Start Social Stream if not already started */
  this.start = function(socket){
    if(twitterStreamRunning === false && launchStreamRunning === false){
      launchStream();
    } /*else {
      //stream is already running
      if (twitterStreamRunning === true && stream_started_on !== null && _stream !== null){
         //relaunch procedure.
      }
    }*/
    socket.emit('connected',{
      channelsDescription : StreamManager.getWatchlists(),
      twitterState : twitterState,
    });
  }

  this.stop = function(socket){
    if (twitterStreamRunning === true) {
      _stream.stop();
      _stream = null;
      stream_started_on = null;
      twitterStreamRunning = false;
      twitterState = STATE_DISCONNECTED;
      socket.emit('disconnected', function(){
        return {
          time: (new Date()).getTime(),
          msg: 'twitter was disconnected'
        }
      });
      console.log('\n\n[ Monitoring Session Ended]\n\n');
    }
  }

  var reformatTweet = function(tweet){
    return {
      tweet: tweet,
      $channels : tweet.$channels,
      $keywords : tweet.$keywords
    };
  };

  var manageEventsBetweenTwitterAndSockets = function(stream){
    stream.on('connect',function(){
      twitterState = STATE_CONNECTING;
      socket.emit('twitter:connect',{twitterState:twitterState});
    });
    stream.on('disconnect',function(){
      twitterState = STATE_DISCONNECTED;
      socket.emit('twitter:disconnect',{twitterState:twitterState});
    });
    stream.on('connected',function(){
      //only emit oonce when it was disconnected
      if(twitterState === STATE_CONNECTED){
        return false;
      }
      twitterState = STATE_CONNECTED;
      socket.emit('twitter:connected',{twitterState:twitterState});
    });
    stream.on('channels',function(tweet){
      socket.emit('data',reformatTweet(tweet));
    });
  };

  /**
   * Manages the start and stop of the Twitter stream
   * - stops it after 15min, then restarts it if there are still sockets opened
   * - adds the events from the twitter stream to the socket
   */
  var launchStream = function(){
    console.log('>calling launchStream');
    launchStreamRunning = true;
    StreamManager.launch(function(stream){
      twitterStreamRunning = true;
      manageEventsBetweenTwitterAndSockets(stream);
      launchStreamRunning = false;
      stream_started_on = (new Date()).getTime();
      _stream = stream;
    },null);

    if(twitterStreamRunning === false && launchStreamRunning === false){
      launchStream();
    }
  };

};

module.exports = SocialStream;
