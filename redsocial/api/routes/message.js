'use strict'

var messageController = require('../controllers/message');
var express = require('express');
var md_auth = require('../midlewares/authenticated');

var api = express.Router();


api.get('/prueba-message', md_auth.ensureAuth, messageController.prueba);
api.post('/save-message', md_auth.ensureAuth, messageController.saveMessage);
api.get('/messages-receiver/:page?', md_auth.ensureAuth, messageController.getMessageReceiver);
api.get('/messages-emitter/:page?', md_auth.ensureAuth, messageController.getEmitteMessage);
api.get('/messages-unviewed', md_auth.ensureAuth, messageController.getUnViewedMessage);
api.put('/update-viewed/:emitter', md_auth.ensureAuth, messageController.setUnViewedMessage);

module.exports = api;