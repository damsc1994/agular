'use strict'

var mongosee = require('mongoose');
var app = require('./app');
var port = 3800;

mongosee.Promise = global.Promise;
mongosee.connect('mongodb://localhost:27017/curso_mean_social', {useMongoClient: true})
 .then(() => {
     console.log("Se ha conectado a la base de datos curso_mean_social");
     app.listen(port, () => {
        console.log("El servidor esta corriendo...");
     });
 })
 .catch(err => {
     console.log("Error al conectar a la bd ", err);
 })
