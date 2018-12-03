'use strict'

var express = require('express');
var UserController = require('../controllers/user');
var multipart = require('connect-multiparty');

var api = express.Router();
var md_auth = require('../midlewares/authenticated');
var md_upload = multipart({uploadDir: './uploads/users'});

api.get('/prueba', md_auth.ensureAuth, UserController.prueba);
api.post('/register',UserController.saveUSer);
api.post('/login', UserController.loginUSer);
api.get('/user/:id', md_auth.ensureAuth, UserController.getUser);
api.get('/users/:page?', md_auth.ensureAuth, UserController.getUsers);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.put('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadAvatar);
api.get('/image-user/:imageFile', UserController.getImageFile);
api.get('/count-user/:id?', md_auth.ensureAuth, UserController.getCounterUser);


module.exports = api;