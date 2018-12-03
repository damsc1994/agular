'use strict'

var express = require('express');
var bodyParse = require('body-parser');

var app = express();

////CARGAR RUTAS////
var user_route = require('./routes/user');
var follow_route = require('./routes/follow');
var publication_route = require('./routes/publication');
var message_route = require('./routes/message');

////MIDLEWARES////
app.use(bodyParse.urlencoded({extended: false}));
app.use(bodyParse.json());


////CORE////
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
 
    next();
});

////RUTAS////
//ruta user
app.use('/api', user_route);
//ruta follow
app.use('/api', follow_route);
//ruta publication
app.use('/api', publication_route);
//ruta message
app.use('/api', message_route);


////EXPORTAMOS////
module.exports = app;



