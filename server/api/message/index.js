'use strict';

var express = require('express');
var controller = require('./message.controller');
var auth = require('../../auth/auth.service')

var router = express.Router();
var twilio = require('twilio');

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);
router.post('/sms/incoming', twilio.webhook(), controller.receiveMessage);
router.get('/reload/inbox', auth.isAuthenticated(), controller.reloadInbox);

module.exports = router;
