'use strict'
var Publication = require('../models/plublication');
var momment = require('moment');
var path = require('path');
var paginate = require('mongoose-pagination');
var Follow = require('../models/follow');
var fs = require('fs');

function prueba(req, res){
    return res.status(200).send({message: 'ESTOY EN CONTROLADOR DE PUBLICACIONES'});
}

function savePublication(req, res){
    var params = req.body;
    var userID = req.user.sub;
    
     
    if(!params.text) return res.status(500).send({message: 'DEBE HABER UN TEXTO EN LA PUBLICACION'});
  
    var publication = new Publication();
    publication.text = params.text;
    publication.file = null;
    publication.crated_at = momment().unix();
    publication.user = userID;

    publication.save((err, publicationStored) =>{
        if(err) return res.status(200).send({message: 'ERROR AL INTENTAR GUARDAR LA PUBLICATION'});
        if(!publicationStored) res.status(404).send({message: 'NO SE GUARDO LA PUBLICACION'});

        res.status(200).send({ 
            publication: publicationStored
        });
    });

}

function getPublications(req, res){
    var userID = req.user.sub;
    var page = 1;
    var itemPerPage = 5;

    if(req.params.page){
        page = req.params.page;
    }

    Follow.find({user: userID}).populate('followed').exec((err, follows) => {
        if(err) return res.status(500).send({message: 'ERROR AL INTENTAR LISTAR FOLLOWS'});

        var follow_arr = [];
        follows.forEach((follow) =>{
            follow_arr.push(follow.followed);
        });

        follow_arr.push(req.user.sub);
    
       Publication.find({user: {"$in": follow_arr}}).sort({'crated_at': -1}).populate('user').paginate(page, itemPerPage, (err, publications, total) =>{
        if(err)  return res.status(500).send({message: 'ERROR AL INTENTAR LISTAR LAS PUBLICACIONES'});
        if(!publications) return res.status(404).send({message: 'NO HAY PUBLICACIONES'});

        return res.status(200).send({
            total,
            publications,
            pages: Math.ceil(total/itemPerPage),
            page,
            itemPerPage
        });
       });

    }); 

}


function getPublicationsUser(req, res){
    var userID = req.user.sub;
    var page = 1;
    var itemPerPage = 5;

    if(req.params.page){
        page = req.params.page;
    }

    var user_id = req.user.sub;
    if (req.params.user_id ){
        user_id = req.params.user_id;
    }

    
    Publication.find({user: user_id}).sort({'crated_at': -1}).populate('user').paginate(page, itemPerPage, (err, publications, total) =>{
        if(err)  return res.status(500).send({message: 'ERROR AL INTENTAR LISTAR LAS PUBLICACIONES'});
        if(!publications) return res.status(404).send({message: 'NO HAY PUBLICACIONES'});

        return res.status(200).send({
            total,
            publications,
            pages: Math.ceil(total/itemPerPage),
            page,
            itemPerPage
        });
    });

 

}

function getPublication(req, res){
    var publication_id = req.params.id;

    Publication.findById(publication_id,(err, publication)=>{
        if(err) return res.status(500).send({message: 'ERROR AL CONSULTAR LA PUBLICACION'});
        if(!publication) return res.status(404).send({message: 'NO HAY PUBLICACION'});

        return res.status(200).send({
            publication
        });
    });
}

function deletePublication(req, res){
  var publication_id = req.params.id;

  Publication.findOneAndRemove({'user': req.user.sub, '_id': publication_id}, (err, publicationRemoved) =>{
    if(err) return res.status(500).send({message: 'ERROR AL ELIMINAR LA PUBLICACION'});
    if(!publicationRemoved) return res.status(404).send({message: 'NO SE ENCONTRO LA PUBLICACION A ELIMINAR'});

    return res.status(200).send({
        publicationRemoved
    });
  });
}

function uploadImage(req, res){
    var publication_id = req.params.id;

    if(req.files.file){
        var file_path = req.files.file.path;
        var path_split = file_path.split('\\');
        
        var image = path_split[2];
        var ext_split = image.split('\.');
        var ext = ext_split[1];
        
        if(ext == 'jpg' || ext == 'png' || ext == 'mp4'){
            Publication.findOneAndUpdate({'_id':publication_id,'user':req.user.sub}
                                 ,{'file': image},{new: true}, (err, publicationUpdated) =>{

                if(err) return res.status(500).send({message: 'ERROR AL ELIMINAR LA PUBLICACION'});

                if(!publicationUpdated) return deleteFile(res, file_path, 'NO SE ENCONTRO EL ARCHIVO A ACTUALIZAR');    

                return res.status(200).send({
                    image: publicationUpdated
                });
            });
        }else{
            return deleteFile(res, file_path, 'EL FORMATO DEL ARCHIVO NO ES VALIDO');
        }

    }else{
        return res.status(404).send({message: 'NO SE HA SUBIDO EL ARCHIVO'});
    }

    
}

function deleteFile(res, file_path, message){
    fs.unlink(file_path, (err) =>{
        if(err) return res.status(500).send({message: 'ERROR AL ELIMINAR ARCHIVO'});

        return res.status(500).send({message: message});
    });

}

function getImageFile(req, res){
    var path_file = './uploads/publications/'+ req.params.file;
   
    fs.exists(path_file, (exist) =>{
        if(exist){
            return res.sendFile(path.resolve(path_file));
        }else{
            return res.status(404).send({message: 'NO EXISTE EL ARCHIVO'});
        }
    });
}

module.exports = {
   prueba,
   savePublication,
   getPublications,
   getPublication,
   deletePublication,
   uploadImage,
   getImageFile,
   getPublicationsUser
};