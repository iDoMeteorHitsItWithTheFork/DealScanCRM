var TwitterStreamChannels;
var config = require('./socialConfig');
var STREAM_TOLERANCE = config.StreamTolerance;

import {Watchlist} from '../../../sqldb';
import {Dealership} from '../../../sqldb';
import {User} from '../../../sqldb';
import {Keyword} from '../../../sqldb';

var StreamManager = function(options){
  this.options = options;
  this.client;
  if(this.options.mock === true){
    console.log('using twitter-stream-channels MOCKED');
    //@todo specify a file for mock via options.tweets and options.singleRun = false
    options.singleRun = false;
    options.tweetDelay = config.mockTweetDelay;
    TwitterStreamChannels = require('twitter-stream-channels').getMockedClass();
  }
  else{
    console.log('using twitter-stream-channels REAL ONLINE');
    TwitterStreamChannels = require('twitter-stream-channels');
  }
  this.client = new TwitterStreamChannels(options);
};

/**
 * Returns the description of the channels to pass on to the front
 * @returns {Object}
 */
StreamManager.prototype.getWatchlists = function(){
  if(this.options.mock === true){
    return require('./channelsDescription.mock.json');
  }
  else{
    return require('./channelsDescription.json');
    // return Watchlist.findAll({
    //   attributes: ['watchlistName', 'watchlistInfo'],
    //   include: [
    //     {
    //       model: Keyword,
    //       attributes: ['keyword'],
    //       required: true
    //     }
    //   ],
    // }).then(function(watchlists){
    //     var channels = [];
    //     if (watchlists){
    //         for(var i  = 0 ; i < watchlists.length; i++) {
    //           var keywords = [];
    //           for(var k = 0; k < watchlists[i].Keywords.length; k++)
    //             keywords.push(watchlists[i].Keywords[k].keyword);
    //           channels.push({
    //             title: watchlists[i].watchlistName,
    //             description: watchlists[i].watchlistInfo,
    //             track: keywords
    //           });
    //         }
    //     }  return channels;
    // }).catch(function(err){
    //    console.log(err);
    //    throw new Error({errorCode: '', errorMessage: 'Unable to retreive Watchlists Details'});
    // })
  }
};

/**
 * Returns a channels object to feed to the track parameter of TwitterStreamChannels.streamChannels
 * @returns {Object}
 */
StreamManager.prototype.getStreamChannelsTrackOptions = function(){
  var that = this;
  if(typeof this.streamChannelsTrackOptions !== 'undefined'){
    return this.streamChannelsTrackOptions;
  }
  else{
    this.streamChannelsTrackOptions = {};
    if (this.options.mock === true) {
      this.getWatchlists().forEach(function (item, i) {
        that.streamChannelsTrackOptions[i] = item.track;
      });
      return this.streamChannelsTrackOptions;
    } else {
      this.getWatchlists().forEach(function (item, i) {
        that.streamChannelsTrackOptions[i] = item.track;
      });
      return this.streamChannelsTrackOptions;
    }
  }
};

/**
 * Beware : stop your streams before calling this function
 * @param {Function} initCallback called immediatly after launch
 * @param {Function} timeoutCallback called after twitterStreamTimeout ms (in order to reopen a Twitter stream only if there are still websockets opened)
 * @returns {Boolean}
 */
StreamManager.prototype.launch = function(initCallback,timeoutCallback){
  var that = this;
  this._stream = this.client.streamChannels({track:this.getStreamChannelsTrackOptions()});
  console.log('>.streamChannels() called - twitter should be requested anytime');
  if(typeof initCallback === 'function'){
    initCallback.call({},this._stream);
  }
  //scheddle the timeout callback when the stream should close - in order to let the socket layer check if there is still someone listening
  if(typeof timeoutCallback === 'function'){
    setTimeout((function(currentStream){
      return function(){
        timeoutCallback.call({},currentStream);
      };
    })(that._stream),STREAM_TOLERANCE);
  }
};

module.exports = StreamManager;
