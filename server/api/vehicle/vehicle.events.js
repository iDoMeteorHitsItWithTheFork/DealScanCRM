/**
 * Vehicle model events
 */

'use strict';

import {EventEmitter} from 'events';
var Vehicle = require('../../sqldb').Vehicle;
var VehicleEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
VehicleEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Vehicle.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    VehicleEvents.emit(event + ':' + doc._id, doc);
    VehicleEvents.emit(event, doc);
    done(null);
  }
}

export default VehicleEvents;
