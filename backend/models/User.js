const mongoose = require('mongoose');
const argon2 = require('argon2');


// Define a schema with a custom collection name
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile_picture: { type: String, default: '' },
    followers: { type: Array, default: [] },
    following: { type: Array, default: [] },
    playlists_created: { type: Array, default: [] },
    playlists_saved: { type: Array, default: [] },
    description: { type: String,default: "" }
});

UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await argon2.hash(this.password);
    }
    next();
});
// Create a model
const connection = mongoose.createConnection('mongodb+srv://hayleydodkins:345803Moo@imy220.klhbn.mongodb.net/Meloob?retryWrites=true&w=majority');
const User = connection.model('User', UserSchema);

module.exports = User;
