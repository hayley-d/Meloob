const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    playlistId: { type: String, required: true },
    date: { type: String, required: true },
    content: { type: String, required: true }
});
const connection = mongoose.createConnection('mongodb+srv://hayleydodkins:345803Moo@imy220.klhbn.mongodb.net/Meloob?retryWrites=true&w=majority');
module.exports = connection.model('Comment', CommentSchema);
