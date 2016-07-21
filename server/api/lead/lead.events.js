/**
 * Lead model events
 */

'use strict';

import {EventEmitter} from 'events';
var Lead = require('../../sqldb').Lead;
var LeadEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
LeadEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Lead.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    LeadEvents.emit(event + ':' + doc._id, doc);
    LeadEvents.emit(event, doc);
    done(null);
  }
}

export default LeadEvents;
