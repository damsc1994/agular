'use strict'

var mongosee = require('mongoose');

var Schema = mongosee.Schema;

var followSchema = Schema({
       user: {type: Schema.ObjectId, ref: 'User'},
       followed: {type: Schema.ObjectId, ref: 'User'}
});


module.exports = mongosee.model('Follow', followSchema);