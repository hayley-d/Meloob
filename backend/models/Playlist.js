const mongoose = require('mongoose');

const PlaylistSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    coverImage: { type: String, required: true },
    date_created: { type: String, required: true },
    genre: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    hashtags: { type: [String] },
    songs: { type: Array, default: [] }
});
const connection = mongoose.createConnection('mongodb+srv://hayleydodkins:345803Moo@imy220.klhbn.mongodb.net/Meloob?retryWrites=true&w=majority');
module.exports = connection.model('Playlist', PlaylistSchema);
