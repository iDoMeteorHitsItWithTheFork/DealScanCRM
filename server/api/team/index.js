'use strict';

var express = require('express');
var controller = require('./team.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.get('/:id/teams', auth.isAuthenticated(), controller.getUserTeams);
router.get('/:id/managers', auth.isAuthenticated(), controller.getManagers);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id',auth.isAuthenticated(),  controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;
