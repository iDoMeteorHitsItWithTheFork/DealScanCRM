'use strict';

var express = require('express');
var controller = require('./socialMedia.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

// router.get('/', auth.isAuthenticated(), controller.index);
// router.get('/:id', auth.isAuthenticated(), controller.show);
// router.post('/', auth.isAuthenticated(), controller.create);
// router.put('/:id', auth.isAuthenticated(), controller.update);
// router.patch('/:id', auth.isAuthenticated(), controller.update);
// router.delete('/:id', auth.isAuthenticated(), controller.destroy);


//Customs Social Media functions
router.get('/twitter/search', auth.isAuthenticated(), controller.searchTwitter);
router.post('/twitter/tweet', auth.isAuthenticated(), controller.tweet);
router.post('/twitter/reTweet', auth.isAuthenticated(), controller.reTweet);
router.post('/twitter/favs', auth.isAuthenticated(), controller.favTweet);
router.put('/facebook/setToken', auth.isAuthenticated(), controller.setFbToken);
router.get('/facebook/search', auth.isAuthenticated(), controller.searchFacebook);



module.exports = router;
