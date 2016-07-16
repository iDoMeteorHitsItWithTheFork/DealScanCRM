/**
 * Bdc model events
 */

'use strict';

import {EventEmitter} from 'events';
var Bdc = require('../../sqldb').Bdc;
var BdcEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
BdcEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Bdc.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    BdcEvents.emit(event + ':' + doc._id, doc);
    BdcEvents.emit(event, doc);
    done(null);
  }
}

export default BdcEvents;
