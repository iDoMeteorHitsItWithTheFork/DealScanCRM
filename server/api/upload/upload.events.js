/**
 * Upload model events
 */

'use strict';

import {EventEmitter} from 'events';
var Upload = require('../../sqldb').Upload;
var UploadEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
UploadEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Upload.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    UploadEvents.emit(event + ':' + doc._id, doc);
    UploadEvents.emit(event, doc);
    done(null);
  }
}

export default UploadEvents;
