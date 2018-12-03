'use strict'

var Follow = require('../models/follow');
var User = require('../models/user');
var mongoosePaginate = require('mongoose-pagination');


function prueba(req, res){
    return res.status(200).send({message: 'BIENVENIDO AL CONTROLADOR DE FOLLOW'});
}


////////GUARDAR FOLLOW
function saveFollow(req, res){
    var params = req.body;
    var follow = new Follow();
    follow.user = req.user.sub;
    follow.followed = params.followed;

    follow.save((err, folowStored) =>{
       if(err) return res.status(500).send({message: 'ERROR AL GUARDAR FOLLOW'});

       if(!folowStored) return res.status(404).send({message: 'NO SE GUARDO EL FOLLOW'});

       return res.status(200).send({follow: folowStored});

    }); 
}


/////////BORRAR FOLLOW
function deleteFollow(req, res){
    var userID = req.user.sub;
    var followedID = req.params.followedID;

    Follow.find({user: userID, followed: followedID}).remove((err) => {
        if (err) return res.status('500').send({message: 'ERROR AL QUITAR FOLLOW'});

        return res.status(200).send({message: 'SE HA ELIMINADO EL FOLLOWED DEL USUARIO '+ followedID});
    });
}


//////////MOSTRAR LISTADO DE SEGUIDOS
function getFollowinUser(req, res){
    var userID = req.params.userID;
    var page = 1;
    var itemPerPage = 4;

    if(req.params.page){
        page = req.params.page;
    }

    

    Follow.find({user: userID}).populate('followed').paginate(page, itemPerPage, (err,follows,total) =>{
        if(err) return res.status(500).send({message: 'ERROR AL LISTAR FOLLOWED'});

        if(!follows) return res.status(404).send({message: 'NO HAY USUARIOS SEGUIDOS'});
        
        followeUsersID(userID, res).then((followeUser) => {
            return res.status(200).send({
                total: total,
                pages: Math.ceil(total/itemPerPage),
                follows,
                followeUser           
            });
        });
    });

}

/////////MOSTRAS LISTADO DE SEGUIDORES
function getFollowedUSer(req, res){
    var userID = req.params.userID;
    var page = 1;
    var itemPerPage =  4;

    if(req.params.page){
        page = req.params.page;
    }

    Follow.find({followed: userID}).populate('user').paginate(page, itemPerPage, (err, follows, total) =>{
         if(err) return res.status(200).send({message: 'ERROR AL INTENTAR CONSULTAR SEGUIDORES'});
         if(!follows) return res.status(404).send({message: 'NO SE OCTUVIERON SEGUIDORES'});

         followeUsersID(userID, res).then((followeUser) => {
            return res.status(200).send({
                total: total,
                pages: Math.ceil(total/itemPerPage),
                follows,
                followeUser           
            });
        });
    });
}

async function followeUsersID(identity_id_user, res){
    var following = await Follow.find({user: identity_id_user}).select({'_id':0, '__v':0, 'user':0}).exec((err, follows) => {
      if(err) return res.status(500).send({message: 'ERROR AL OCTENER LOS FOLLOWING'});
      
      return follows;
    });
  
    var followers = await Follow.find({followed: identity_id_user}).select({'_id':0, '__v':0, 'followed':0}).exec((err, follows) => {
      if(err) return res.status(500).send({message: 'ERROR AL OCTENER LOS FOLLOWED'});
  
      return follows;
    })
  
    //////PROCESAR FOLLOWING
    var following_arr = [];
    following.forEach((follows) => {
      following_arr.push(follows.followed);
    });
  
    //////PROCESAR FOLLOWER
    var followers_arr = [];
    followers.forEach((follows) => {
      followers_arr.push(follows.user);
    });
  
    console.log(following_arr);
  
    return {
      following_arr,
      followers_arr
    };
  }

///////DEVUELVE LISTA DE USUARIO
function getMyFollows(req, res){
    var userID = req.user.sub;
    var tipo = 'SEGUIDOS';

    var find = Follow.find({user: userID});
    if(req.params.followed){
        tipo = 'SEGUIDORES';
        find = Follow.find({followed: userID});
    }

    find.populate('user followed').exec((err, follows) =>{
        if(err) return res.status(500).send({message: 'ERROR AL OCTENER FOLLOWS'});
        if(!follows) return resolve.status(404).send({message: 'NO HAY FOLLOWS'});

        res.status(200).send({
            tipo,
            follows
        })
    });
}

module.exports = {
    prueba,
    saveFollow,
    deleteFollow,
    getFollowinUser,
    getFollowedUSer,
    getMyFollows
}
