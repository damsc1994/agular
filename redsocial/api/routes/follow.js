'use strict'


var followController = require('../controllers/follow');
var express = require('express');
var md_auth = require('../midlewares/authenticated');

var api = express.Router();

api.get('/prueba-follow', md_auth.ensureAuth, followController.prueba);
api.post('/save-follow', md_auth.ensureAuth, followController.saveFollow);
api.delete('/delete-follow/:followedID', md_auth.ensureAuth, followController.deleteFollow);
api.get('/following/:userID/:page?', md_auth.ensureAuth, followController.getFollowinUser);
api.get('/followed/:userID/:page?', md_auth.ensureAuth, followController.getFollowedUSer)
api.get('/myfollows/:followed?',md_auth.ensureAuth, followController.getMyFollows);



module.exports = api;

