'use strict'

var publicationController = require('../controllers/publication');
var express = require('express');
var md_auth = require('../midlewares/authenticated');
var multipart = require('connect-multiparty');

var md_upload = multipart({uploadDir: './uploads/publications'})
var api = express.Router();

api.get('/publications-prueba', md_auth.ensureAuth, publicationController.prueba);
api.post('/save-publication', md_auth.ensureAuth, publicationController.savePublication);
api.get('/publications/:page?', md_auth.ensureAuth, publicationController.getPublications);
api.get('/publication/:id', md_auth.ensureAuth, publicationController.getPublication);
api.delete('/publication-delete/:id', md_auth.ensureAuth, publicationController.deletePublication);
api.put('/upload-image/:id', [md_auth.ensureAuth, md_upload], publicationController.uploadImage);
api.get('/publication-image/:file', publicationController.getImageFile);
api.get('/publications-user/:user_id/:page?', md_auth.ensureAuth, publicationController.getPublicationsUser);


module.exports = api;
