'use strict';

var express = require('express');
var controller = require('./lead.controller');
var auth = require('../../auth/auth.service')

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.get('/stats/leads', auth.isAuthenticated(), controller.totalLeads);
router.get('/scheduled/appointments', auth.isAuthenticated(), controller.scheduledAppointments);
router.get('/stats/appointments', auth.isAuthenticated(), controller.totalAppointments);
router.get('/stats/appointments/kept', auth.isAuthenticated(), controller.keptAppointments);
router.get('/stats/appointments/missed', auth.isAuthenticated(), controller.missedAppointments);
router.get('/stats/appointments/sold', auth.isAuthenticated(), controller.soldAppointments);
router.get('/stats/messages/sent', auth.isAuthenticated(), controller.getSentMessages);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.put('/schedule/appointment', auth.isAuthenticated(), controller.scheduleAppointment);
router.put('/add/note', auth.isAuthenticated(), controller.addNote);
router.put('/assign/agent', auth.isAuthenticated(), controller.assignLead);
router.put('/assign/lead', auth.isAuthenticated(), controller.assignAgent);
router.patch('/:id', auth.isAuthenticated(),controller.update);
router.delete('/:id', auth.isAuthenticated(),controller.destroy);

module.exports = router;
