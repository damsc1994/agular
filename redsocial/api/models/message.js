'use strict'

var mongosee = require('mongoose');

var Schema = mongosee.Schema;

var messageSchema = Schema({
      text: String,
      viewed: Boolean,
      created_at: String,
      emitter: {type: Schema.ObjectId, ref: 'User'},
      receiver: {type: Schema.ObjectId, ref: 'User'}
});


module.exports = mongosee.model('Message', messageSchema);