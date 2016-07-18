/**
 * Main application file
 */

'use strict';

import express from 'express';
import sqldb from './sqldb';
import config from './config/environment';
import http from 'http';

// var mailin = require('mailin');



// Populate databases with sample data
if (config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();
var server = http.createServer(app);
var socketio = require('socket.io')(server, {
  serveClient: config.env !== 'production',
  path: '/socket.io-client'
});

//Socket Connection Manager
require('./config/socketio')(socketio);
require('./config/express')(app);
require('./routes')(app);
// parse application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
//app.use(bodyParser.json())
// Start server
function startServer() {
  app.angularFullstack = server.listen(config.port, config.ip, function() {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
}


sqldb.sequelize.sync()
  .then(startServer)
  .catch(function(err) {
    console.log('Server failed to start due to error: %s', err);
  });


//require('./backgroundTasks/DbSync').start();

/* Start the Mailin server. The available options are:
 *  options = {
 *     port: 25,
 *     webhook: 'http://mydomain.com/mailin/incoming,
 *     disableWebhook: false,
 *     logFile: '/some/local/path',
 *     logLevel: 'warn', // One of silly, info, debug, warn, error
 *     smtpOptions: { // Set of options directly passed to simplesmtp.createServer(smtpOptions)
 *        SMTPBanner: 'Hi from a custom Mailin instance'
 *     }
 *  };
 * Here disable the webhook posting so that you can do what you want with the
 * parsed message. */
// mailin.start({
//   port: 3000,
//   host: '127.0.0.1',
//   webhook: 'http://localhost:9000/webhook'
// });
//
// /* Access simplesmtp server instance. */
// mailin.on('authorizeUser', function(connection, username, password, done) {
//   if (username == "johnsmith" && password == "mysecret") {
//     done(null, true);
//   } else {
//     done(new Error("Unauthorized!"), false);
//   }
// });
//
// /* Event emitted when a connection with the Mailin smtp server is initiated. */
// mailin.on('startMessage', function (connection) {
//   /* connection = {
//    from: 'sender@somedomain.com',
//    to: 'someaddress@yourdomain.com',
//    id: 't84h5ugf',
//    authentication: { username: null, authenticated: false, status: 'NORMAL' }
//    }
//    }; */
//   console.log(connection);
// });
//
// /* Event emitted after a message was received and parsed. */
// mailin.on('message', function (connection, data, content) {
//   console.log(data);
//   /* Do something useful with the parsed message here.
//    * Use parsed message `data` directly or use raw message `content`. */
// });
//
// app.head('/webhook', function (req, res) {
//   console.log('Received head request from webhook.');
//   res.send(200);
// });


// Expose app
exports = module.exports = app;
