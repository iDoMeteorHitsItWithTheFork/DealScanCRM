/**
 * Watchlist model events
 */

'use strict';

import {EventEmitter} from 'events';
var Watchlist = require('../../sqldb').Watchlist;
var WatchlistEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
WatchlistEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Watchlist.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    WatchlistEvents.emit(event + ':' + doc._id, doc);
    WatchlistEvents.emit(event, doc);
    done(null);
  }
}

export default WatchlistEvents;
