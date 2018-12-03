"use strict";

var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var Follow = require('../models/follow');
var Publication = require('../models/plublication');
var fs = require('fs');
var path = require('path');
var moongosePaginate = require('mongoose-pagination');

function prueba(req, res){
  return res.status(200).send({
    message: 'hola a todos'
  });
}

function saveUSer(req, res) {
  var params = req.body;
  var user = new User();
  if (
    params.name &&
    params.surname &&
    params.nick &&
    params.password &&
    params.email
  ) {
    user.name = params.name;
    user.surname = params.surname;
    user.nick = params.nick;
    user.password = params.password;
    user.email = params.email;
    user.role = "ROLE_USER";
    user.image = null;

    //Controlar usuario existente
    User.find({
      $or: [
        { nick: user.nick.toLowerCase() },
        { email: user.email.toLowerCase() }
      ]
    }).exec((err, users_list) => {
      if (err) return res
              .status(500)
              .send({ message: "ERROR AL COMPROBAR USUARIO EXISTENTE" });

      if (users_list.length >= 1) {
        return res.status(200).send({ message: "EL USUARIO YA EXISTE" });
      } else {
        ////Crea hash de contraseña y guarda
        bcrypt.hash(params.password, null, null, (err, hash) => {
          if(err) return res.status(500).send({message: 'EL ERROR AL OBTENER EL HASH DE LA CONTRASEÑA'});

          user.password = hash;
          user.save((err, userStored) => {
            if (err)
              return res
                .status(500)
                .send({ message: "ERROR AL GUARDAR EL USUARIO" });

            if (userStored) {
              userStored.password = undefined;
              return res.status(200).send({ user: userStored });
            } else {
              return res
                .status(404)
                .send({ message: "NO SE HA REGISTRADO EL USUARIO" });
            }
          });
        });
      }
    });
  } else {
    res.status(200).send({
      message: "Debe registrar todos los campos"
    });
  }
}


function loginUSer(req, res){ 
    var params = req.body;
    var email = params.email;
    var password = params.password;

    User.findOne({email: email}, (err, user) => {
         if(err) return res.status(500).send({message: 'ERROR AL CONSULTAR EMAIL'});
       
         if(user){
          bcrypt.compare(password, user.password, (err, check) => {
            if(err) return res.status(500).send({message: 'ERROR AL COMPARA CONTRASEÑA (HASH)'});

            if(check){

              if(params.gettoken){
                //// Genero y Devuelvo tokken
                return res.status(200).send({
                  tokken: jwt.createTokkens(user)
                });
              }else{
                user.password = undefined;
                return res.status(200).send({user});
              }
              
            }
            return res.status(404).send({message: 'CONTRASEÑA INCORRECTA'})
           });
         }else{
          return res.status(404).send({message: 'EL EMAIL NO SE HA ENCONTRADO'});
         }

         
    });
}

//////Consultar Usario/////
function getUser(req, res){
  var userID = req.params.id;
   
  User.findById(userID, (err, user) => {
     if(err) return res.status(500).send({message: 'ERROR EN LA PETICION'});

     if(!user) return res.status(404).send({message: 'USUARIO NO ENCONTRADO'});

     followThisUser(req.user.sub, userID, res).then((value) => {
         return res.status(200).send({
            user,
            value
         });
     });
        

     
  });

}

async function followThisUser(identity_id_user, id_user, res){
  var following = await Follow.findOne({user: identity_id_user, followed: id_user}).exec((err, follow) =>{
    if(err) return res.status(500).send({message: 'ERROR AL VERIFICAR FOLLOWING'});
    
    return follow;
  });

  var followers = await Follow.findOne({user: id_user, followed: identity_id_user}).exec((err, follow) =>{
    if(err) return res.status(500).send({message: 'ERROR AL VERIFICAR FOLLOWED'});
    
    return follow;
  });

  return {
    following,
    followers
  }

}
///////Listar Usuarios
function getUsers(req, res){
  var id_user = req.user.sub;

  var page = 1;
  if(req.params.page){
    page = req.params.page;
  }

  var itemsPerPage = 5;
  User.find().sort('name').paginate(page, itemsPerPage, (err, users, total) =>{
      if(err) return res.status(500).send({message: 'ERROR AL LISTAR LOS USUARIOS'});
      if(!users) return res.status(404).send({message: 'NO SE HAN ENCONTRADO USUARIOS'});

      followeUsersID(id_user, res).then((follows) => {
        return res.status(200).send({
          users: users,
          follows: follows,
          total: total,
          pages: Math.ceil(total/itemsPerPage)
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

////Modificar usuarios
function updateUser(req, res){
  var id_user = req.params.id;
  var update = req.body;
  var verificar_update;
  var diferente = String;

  if(id_user != req.user.sub){
    return res.status(500).send({message: 'NO TIENES PERMISO PARA ACTUALIZAR ESTE USUARIO'})
  }

  User.find({$or:[{'email': update.email},
                    {'nick': update.nick}]}).exec((err, user_list) =>{
        var encontrado = false;              
        if(user_list.length > 0){             
         user_list.forEach((user) =>{
          if(user._id != update._id){
            if(user.nick === update.nick){
              encontrado = true;
              return res.status(500).send({message: 'EL NICK YA ESTAN EN USO'});
            }
  
            if(user.email === update.email){
              encontrado = true;
              return res.status(500).send({message: 'EL EMAIL YA ESTAN EN USO'});
            }
          }

        });
        if(encontrado == false){
         User.findByIdAndUpdate(id_user, update, {new: true}, (err, updateUser) => {
          if(err) return res.status(500).send({message: 'ERROR AL INTENTAR ACTUALIZAR AL USUARIO '});
          if(!updateUser) return res.status(404).send({message: 'NO SE HA ENCONTRADO EL USUARIO QUE QUIERE MODIFICAR'});
              
          return res.status(200).send({
                 user: updateUser
            });
         });
        }

      }else{
          User.findByIdAndUpdate(id_user, update, {new: true}, (err, updateUser) => {
            if(err) return res.status(500).send({message: 'ERROR AL INTENTAR ACTUALIZAR AL USUARIO '});
            if(!updateUser) return res.status(404).send({message: 'NO SE HA ENCONTRADO EL USUARIO QUE QUIERE MODIFICAR'});
                
            return res.status(200).send({
                   user: updateUser
              });
          });
      }
        
   }); 
}



function uploadAvatar(req, res){
  var id_user = req.params.id;

  if(req.files.image){
    var file_path = req.files.image.path;
    
    if(id_user != req.user.sub){
      return deleteFileUpload(res, file_path, 'NO TIENES PERMISO PARA CARGAR EL AVATAR A ESTE USUARIO');
    }
    
     var path_split = file_path.split('\\');
     var image_name = path_split[2];
     var ext_split = image_name.split('\.');
     var ext = ext_split[1];

     if(ext == 'jpg' || ext == 'png' || ext == 'gif' || ext == 'jpeg'){
        User.findByIdAndUpdate(id_user,{image: image_name},{new: true}, (err, userUpdated) => {
           if(err) return res.status(500).send({message: 'ERROR AL ACTUALIZAR AL USAURIO'});
           if(!userUpdated) return res.status(404).send({message: 'NO SE HA ENCONTRADO EL USUARIO'});
           console.log(userUpdated);
           return res.status(200).send({
             user: userUpdated
           });
        }); 
     }else{
        return deleteFileUpload(res, file_path, 'EL ARCHIVO QUE INTENTA SUBIR NO ES UNA IMAGEN');
     }
    
  }else{
    return res.status(200).send({message: 'NO SE HA SUBIDO ARCHIVO'});
  }


}

function deleteFileUpload(res, file_path, message){
  fs.unlink(file_path, (err) =>{
    return res.status(500).send({message: message})
  });
}

function getImageFile(req, res){
  var imageFile = req.params.imageFile;
  var path_images = './uploads/users/'+ imageFile;
    
  fs.exists(path_images, (exists) =>{
      if(exists) return res.sendFile(path.resolve(path_images));   

      return res.status(404).send({message: 'NO SE HA ENCONTRADO LA IMAGEN!'})
  });

}

 ///////CONTADOR DE SEGUIDORES Y SEGUIDOS
 function getCounterUser(req, res){
  var userID = req.user.sub;

  if(req.params.id){
     userID = req.params.id;
  }

  counterFollows(userID, res).then((count) => {
    return res.status(200).send({
      following: count.following,
      followers: count.followers,
      publications: count.publications
    });
  })

}

async function counterFollows(user_id, res){
  var following = await Follow.count({'user': user_id}).exec((err, count) =>{
    if(err) return resizeBy.status(500).send({message: 'ERROR AL OCTENER LA CANTIDAD DE SEGUIDOS'});
    

    return count;
  });

  var followers = await Follow.count({'followed': user_id}).exec((err, count) =>{
    if(err) return res.status(200).send({message: 'ERROR AL OCTENER LA CANTIDAD DE SEGUIDORES'});

    return count;
  });

  var publications = await Publication.count({'user': user_id}).exec((err, count) =>{
       if(err) return res.status(500).send({message: 'ERROR AL INTENTAR SACAR LA CANTIDAD DE PUBLICACIONES'});

       return count;
  });

  return {
    following,
    followers,
    publications
  };
}

module.exports = {
  prueba,
  saveUSer,
  loginUSer,
  getUser,
  getUsers,
  updateUser,
  uploadAvatar,
  getImageFile,
  getCounterUser
};
