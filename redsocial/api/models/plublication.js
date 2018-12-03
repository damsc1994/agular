'use strict'

var mongosee = require('mongoose');

var Schema = mongosee.Schema;

var publicationSchema = Schema({
    text: String,
    file: String,
    crated_at: String,
    user: {type: Schema.ObjectId, ref: 'User'}
});

module.exports = mongosee.model('Publication', publicationSchema);

