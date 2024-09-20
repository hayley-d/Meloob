const mongoose = require('mongoose');

const GenreSchema = new mongoose.Schema({
    name: String,
}, { collection: 'genres' });

const connection = mongoose.createConnection('mongodb+srv://hayleydodkins:345803Moo@imy220.klhbn.mongodb.net/Meloob?retryWrites=true&w=majority');
module.exports = connection.model('Genre', GenreSchema);


