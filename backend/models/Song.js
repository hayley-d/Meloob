const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
    title: String,
    artist: String,
    link: String,
    genre: String
}, { collection: 'songs' });

const connection = mongoose.createConnection('mongodb+srv://hayleydodkins:345803Moo@imy220.klhbn.mongodb.net/Meloob?retryWrites=true&w=majority');
module.exports = connection.model('Song', SongSchema);


