'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'CLAVE_SECRETA_TOKKEN';

exports.ensureAuth = function (req, res, next){
    if(!req.headers.authorization) return res.status(404).send({message: 'NO HAY CABECERA DE AUTENTICACION'});

    var tokken  = req.headers.authorization.replace(/['"]+/g, '');

    try{
       var payload = jwt.decode(tokken, secret);
    
       if(payload.exp <= moment.unix()) return res.status(403).send({
        message: 'EL TIEMPO DE EXPIRACION DEL TOKKEN SE HA CUMPLIDO'
       });
       
    }catch(exc){
        return res.status(500).send({message: 'EXEPCION EN authenticated.js '+ exc});
    }

    console.log('usaurio logueado '+ payload.sub);
    req.user = payload;

    next();

}
