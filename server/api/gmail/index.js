'use strict';


'use strict';

var express = require('express');
var controller = require('./gmail.controller');
var auth = require('../../auth/auth.service');
var passport = require('passport');

var router = express.Router();

router.get('/emails', passport.authenticate('google'), controller.index);

module.exports = router;


