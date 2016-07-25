'use strict';

var express = require('express');
var controller = require('./lead.controller');
var auth = require('../../auth/auth.service')

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.put('/schedule/appointment', auth.isAuthenticated(), controller.scheduleAppointment);
router.put('/add/note', auth.isAuthenticated(), controller.addNote);
router.patch('/:id', auth.isAuthenticated(),controller.update);
router.delete('/:id', auth.isAuthenticated(),controller.destroy);

module.exports = router;
