/**
 * Rebate model events
 */

'use strict';

import {EventEmitter} from 'events';
var Rebate = require('../../sqldb').Rebate;
var RebateEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
RebateEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Rebate.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    RebateEvents.emit(event + ':' + doc._id, doc);
    RebateEvents.emit(event, doc);
    done(null);
  }
}

export default RebateEvents;
