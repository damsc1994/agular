'use strict'

var Message = require('../models/message');
var Follow = require('../models/follow');
var moment = require('moment');
var pagination = require('mongoose-pagination');



function prueba(req, res){
    return res.status(200).send({message: 'ESTOY EN CONTROLADOR DE MENSAJES'});
}

function saveMessage(req, res){
    var params = req.body;

    if(!params.receiver || !params.text) return res.status(200).send({message: 'DEBE LLENAR LOS CAMPOS OBLIGATORIOS'});

    var message = new Message();
    message.emitter = req.user.sub;
    message.text = params.text;
    message.receiver = params.receiver;
    message.created_at = moment().unix();
    message.viewed = false;

    message.save((err, messageStored) => {
        if(err) return res.status(500).send({message: 'ERROR AL INTENTAR GUARDAR EL MENSAJE'});

        return res.status(200).send({
            messageStored
        });
    });
}


function getMessageReceiver(req, res){
    var userID = req.user.sub;
    var page = 1;
    var itemPerPage = 5;
    
    if(req.params.page){
        page = req.params.page;
    }

    Message.find({'receiver': userID}).populate('emitter').paginate(page,itemPerPage, (err, messages, total) =>{
        if(err) return res.status(500).send({message: 'ERROR AL CONSULTAR LOS MENSAJES'});

        if(messages.length < 1) return res.status(404).send({messages: 'NO TIENE MENSAJES RECIVIDOS'});

        return res.status(200).send({
            messages,
            pages: Math.ceil(total/itemPerPage)  
        });
    });
}

function getEmitteMessage(req, res){
    var userID = req.user.sub;
    var page = 1;
    var itemPerPage = 5;

    if(req.params.page){
        page = req.params.page;
    }


    Message.find({'emitter': userID}).populate('receiver').paginate(page, itemPerPage, (err, messages, total) =>{
        if(err) return res.status(500).send({message: 'ERROR AL INTENTAR OBTENER LOS MENSAJES ENVIADOS'});
        if(messages.length < 1) return res.status(404).send({message: 'NO TIENES MENSAJES ENVIADOS'});

        return res.status(200).send({
            messages,
            pages: Math.ceil(total/itemPerPage)
        });
    });

}

function getUnViewedMessage(req, res){
    var userID = req.user.sub;

    Message.count({'receiver': userID, 'viewed':false}).exec((err, count) =>{
        if(err) return res.status(500).send({message:'ERROR AL OBTNERT CANTIDAD DE MENSAJE SIN LEER'});

        return res.status(200).send({
            unviewed: count
        });
    });
}

function setUnViewedMessage(req, res){
    var userID = req.user.sub;
    var emitter = req.params.emitter;

    Message.updateMany({'receiver': userID, 'emitter': emitter, 'viewed': false}, {'viewed': true}).exec((err, messageStored) =>{
        if(err) return res.status(500).send({message:'ERROR AL ACTUALIZAR LOS VIEWED'});

        return res.status(200).send({
            message: messageStored
        });
    });
}


module.exports = {
    prueba,
    saveMessage,
    getMessageReceiver,
    getEmitteMessage,
    getUnViewedMessage,
    setUnViewedMessage
};