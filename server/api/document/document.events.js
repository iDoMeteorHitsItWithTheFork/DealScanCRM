/**
 * Document model events
 */

'use strict';

import {EventEmitter} from 'events';
var Document = require('../../sqldb').Document;
var DocumentEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
DocumentEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Document.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    DocumentEvents.emit(event + ':' + doc._id, doc);
    DocumentEvents.emit(event, doc);
    done(null);
  }
}

export default DocumentEvents;
