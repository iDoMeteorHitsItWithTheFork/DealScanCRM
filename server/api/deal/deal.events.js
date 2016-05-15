/**
 * Deal model events
 */

'use strict';

import {EventEmitter} from 'events';
var Deal = require('../../sqldb').Deal;
var DealEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
DealEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Deal.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    DealEvents.emit(event + ':' + doc._id, doc);
    DealEvents.emit(event, doc);
    done(null);
  }
}

export default DealEvents;
