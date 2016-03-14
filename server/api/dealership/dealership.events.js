/**
 * Dealership model events
 */

'use strict';

import {EventEmitter} from 'events';
var Dealership = require('../../sqldb').Dealership;
var DealershipEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
DealershipEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Dealership.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    DealershipEvents.emit(event + ':' + doc._id, doc);
    DealershipEvents.emit(event, doc);
    done(null);
  }
}

export default DealershipEvents;
