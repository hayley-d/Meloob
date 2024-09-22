const express = require('express');
const User = require('./models/User');
const Genre = require('./models/Genre');
const Playlist = require('./models/Playlist');
const Comment = require('./models/Comment');
const Song = require('./models/Song');
const argon2 = require('argon2');
const { MongoClient, ObjectId} = require('mongodb');
const { mongoose } = require('mongoose');

const userRoutes = express.Router();

/**
 * Creates a new user after signup.
 *
 * @route POST /api/signup
 * @param {Object} req.body - The user details for the new account.
 * @param {string} req.body.username - The username of the new user.
 * @param {string} req.body.email - The email address of the new user.
 * @param {string} req.body.password - The password for the new user account (should be hashed).
 * @param {string} [req.body.profile_picture] - Optional profile picture URL for the new user.
 * @param {Array<string>} [req.body.followers] - List of follower IDs for the new user (initially empty).
 * @param {Array<string>} [req.body.following] - List of IDs of users the new user is following (initially empty).
 * @param {Array<string>} [req.body.playlists_created] - List of playlist IDs created by the user (initially empty).
 * @param {Array<string>} [req.body.playlists_saved] - List of playlist IDs saved by the user (initially empty).
 * @param {string} [req.body.description] - Optional description or bio for the new user.
 * @returns {Object} - The newly created user object.
 * @throws {Error} - Returns a 400 status code for validation or creation errors.
 *
 * @example
 * // Successful response example:
 * {
 *   "id": "64e3f1bc9f12a61d2c5a4c58",
 *   "username": "newuser",
 *   "email": "newuser@example.com",
 *   "password": "hashedPassword",
 *   "profile_picture": "profilePic.jpg",
 *   "followers": [],
 *   "following": [],
 *   "playlists_created": [],
 *   "playlists_saved": [],
 *   "description": "New user bio."
 * }
 *
 * @example
 * // Error response example:
 * {
 *   "message": "Error creating user"
 * }
 */
userRoutes.post('/signup', async (req, res) => {
    try {
        const { username, email, password, profile_picture, followers, following, playlists_created, playlists_saved,description } = req.body;
        console.log(req.body);

        const newUser = new User({
            username,
            email,
            password,
            profile_picture,
            followers,
            following,
            playlists_created,
            playlists_saved,
            description
        });
        console.log(newUser);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * Retrieves a list of all genres.
 *
 * @route GET /api/genres
 * @returns {Array<Object>} - An array of genre objects.
 * @throws {Error} - Returns a 400 status code for server errors.
 *
 * @example
 * // Successful response example:
 * [
 *   {
 *     "id": "64e3f1bc9f12a61d2c5a4c58",
 *     "name": "genre1",
 *   },
 *   // More genres...
 * ]
 *
 * @example
 * // Error response example:
 * {
 *   "error": "Failed to fetch genres"
 * }
 */
userRoutes.get('/genres', async (req, res) => {
    try {
        const genres = await Genre.find().exec();
        res.status(200).json(genres);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

/**
 * Retrieves a list of all users.
 *
 * @route GET /api/users
 * @returns {Array<Object>} - An array of user objects.
 * @throws {Error} - Returns a 400 status code for server errors.
 *
 * @example
 * // Successful response example:
 * [
 *   {
 *     "id": "64e3f1bc9f12a61d2c5a4c58",
 *     "username": "user123",
 *     "email": "user@example.com",
 *     "password": "hashedPassword",
 *     "profile_picture": "profilePic.jpg",
 *     "followers": ["64e3f1bc9f12a61d2c5a4c57"],
 *     "following": ["64e3f1bc9f12a61d2c5a4c59"],
 *     "playlists_created": ["64e3f1bc9f12a61d2c5a4c5a"],
 *     "playlists_saved": ["64e3f1bc9f12a61d2c5a4c5b"],
 *     "description": "User bio goes here."
 *   },
 *   // More users...
 * ]
 *
 * @example
 * // Error response example:
 * {
 *   "error": "Failed to fetch users"
 * }
 */
userRoutes.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

/**
 * Retrieves a user by their ID.
 *
 * @route GET /api/users/:id
 * @param {string} id - The ID of the user to retrieve.
 * @returns {Object} - The user object with details.
 * @throws {Error} - Returns a 404 status code if the user is not found or a 500 status code for server errors.
 *
 * @example
 * // Successful response example:
 * {
 *   "id": "64e3f1bc9f12a61d2c5a4c58",
 *   "username": "user123",
 *   "email": "user@example.com",
 *   "password": "hashedPassword",
 *   "profile_picture": "profilePic.jpg",
 *   "followers": ["64e3f1bc9f12a61d2c5a4c57"],
 *   "following": ["64e3f1bc9f12a61d2c5a4c59"],
 *   "playlists_created": ["64e3f1bc9f12a61d2c5a4c5a"],
 *   "playlists_saved": ["64e3f1bc9f12a61d2c5a4c5b"],
 *   "description": "User bio goes here."
 * }
 *
 * @example
 * // Error response example:
 * // User not found
 * {
 *   "message": "No user found"
 * }
 *
 * // Server error
 * {
 *   "error": "Failed to fetch user"
 * }
 */
userRoutes.get('/users/:id', async (req, res) => {
    try {
        const objectId = new ObjectId(req.params.id);
        const user = await User.findById(objectId).exec();

        if (user) {

            const formatted = {
                id: user._id.toString(),  // Convert ObjectId to string
                username: user.username,
                email:user.email,
                password: user.password,
                profile_picture: user.profile_picture,
                followers: user.followers,
                following:user.following,
                playlists_created: user.playlists_created,
                playlists_saved: user.playlists_saved,
                description : user.description
            };
            //console.log(formatted);
            res.status(200).json(formatted);  // Return songs as JSON
        } else {
            res.status(404).json({ message: 'No user found' });
        }
    } catch (error) {
        console.error("Error fetching songs:", error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

/**
 * Updates the details of a user by their ID.
 *
 * @route PUT /api/user/:id
 * @param {string} id - The ID of the user to update.
 * @param {Object} req.body - The details to update for the user.
 * @param {string} [req.body.username] - The new username of the user.
 * @param {string} [req.body.description] - The new description of the user.
 * @param {string} [req.body.profile_picture] - The new profile picture URL of the user.
 * @returns {Object} - The updated user object.
 * @throws {Error} - Returns a 404 status code if the user is not found or a 500 status code for server errors.
 *
 * @example
 * // Request body:
 * {
 *   "username": "newUsername",
 *   "description": "Updated user description",
 *   "profile_picture": "newProfilePic.jpg"
 * }
 *
 * // Successful response example:
 * {
 *   "id": "64e3f1bc9f12a61d2c5a4c58",
 *   "username": "newUsername",
 *   "email": "user@example.com",
 *   "profile_picture": "newProfilePic.jpg",
 *   "followers": ["64e3f1bc9f12a61d2c5a4c57"],
 *   "following": ["64e3f1bc9f12a61d2c5a4c59"],
 *   "playlists_created": ["64e3f1bc9f12a61d2c5a4c5a"],
 *   "playlists_saved": ["64e3f1bc9f12a61d2c5a4c5b"],
 *   "description": "Updated user description"
 * }
 *
 * @example
 * // Error response example:
 * // User not found
 * {
 *   "message": "User not found"
 * }
 *
 * // Server error
 * {
 *   "message": "Server error"
 * }
 */
userRoutes.put('/user/:id', async (req, res) => {
    const { id } = req.params;
    const { username, description, profile_picture } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(id, {
            username,
            description,
            profile_picture,
        }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * Logs a user in by verifying their email and password.
 *
 * @route POST /api/login
 * @param {Object} req - The request object containing the user's credentials.
 * @param {string} req.body.email - The email of the user trying to log in.
 * @param {string} req.body.password - The password of the user trying to log in.
 * @returns {Object} - A response object with a success message and the user details if login is successful.
 * @throws {Error} - Returns a 404 status code if the user is not found, a 400 status code for invalid password, or a 500 status code for server errors.
 *
 * @example
 * // Request body:
 * {
 *   "email": "user@example.com",
 *   "password": "userPassword"
 * }
 *
 * // Successful response example:
 * {
 *   "message": "Login successful",
 *   "user": {
 *     "id": "64e3f1bc9f12a61d2c5a4c58",
 *     "username": "johndoe",
 *     "email": "user@example.com",
 *     "profile_picture": "profilePic.jpg",
 *     "followers": ["64e3f1bc9f12a61d2c5a4c57"],
 *     "following": ["64e3f1bc9f12a61d2c5a4c59"],
 *     "playlists_created": ["64e3f1bc9f12a61d2c5a4c5a"],
 *     "playlists_saved": ["64e3f1bc9f12a61d2c5a4c5b"],
 *     "description": "Music lover"
 *   }
 * }
 *
 * @example
 * // Error response example:
 * // User not found
 * {
 *   "message": "User not found"
 * }
 *
 * // Invalid password
 * {
 *   "message": "Invalid password"
 * }
 */
userRoutes.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify password
        const isMatch = await argon2.verify(user.password, password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        req.session.user = user;
        res.status(200).json({ message: 'Login successful' ,user:user});

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Fetches all playlists from the database.
 *
 * @route GET /api/playlists
 * @returns {Array<Object>} - An array of playlist objects.
 *
 * @example
 * // Request URL:
 * GET /api/playlists
 *
 * // Successful response example:
 * [
 *   {
 *     "id": "64e3f1bc9f12a61d2c5a4c58",
 *     "userId": "64e3f1bc9f12a61d2c5a4c57",
 *     "coverImage": "coverImage1.jpg",
 *     "date_created": "2023-09-09T12:00:00.000Z",
 *     "genre": "Pop",
 *     "name": "Chill Vibes",
 *     "description": "A playlist for relaxing vibes.",
 *     "hashtags": ["#chill", "#vibes"],
 *     "songs": ["songId1", "songId2"]
 *   },
 *   {
 *     "id": "64e3f1bc9f12a61d2c5a4c59",
 *     "userId": "64e3f1bc9f12a61d2c5a4c56",
 *     "coverImage": "coverImage2.jpg",
 *     "date_created": "2023-08-15T15:30:00.000Z",
 *     "genre": "Rock",
 *     "name": "Rock Anthems",
 *     "description": "Best rock songs of all time.",
 *     "hashtags": ["#rock", "#anthems"],
 *     "songs": ["songId3", "songId4"]
 *   }
 * ]
 *
 * @throws {Error} - Returns a 500 status code if there's an issue fetching the playlists.
 * @returns {Array<Object>} - An array of formatted playlist objects, or a 404 error if no playlists are found.
 */
userRoutes.get('/playlists', async (req, res) => {
    try {
        const playlists = await Playlist.find({}).exec();
        if (playlists && playlists.length > 0) {
            const genres = await Genre.find().exec();
                const formatted = playlists.map(playlist => {
                const genre_name = genres.find(g => g._id.toString() === playlist.genre.toString());
                return {
                    id: playlist._id.toString(),  
                    userId: playlist.userId,
                    coverImage: playlist.coverImage,
                    date_created: playlist.date_created,
                    genre: genre_name ? genre_name.name : 'Unknown Genre',                      
                    name: playlist.name,
                    description: playlist.description,
                    hashtags: playlist.hashtags,
                    songs: playlist.songs
                };
            });   
            res.status(200).json(formatted); 
        } else {
            res.status(404).json({ message: 'No playlist found' });
        }
    } catch (error) {
        console.error("Error fetching playlists:", error);
        res.status(500).json({ error: 'Failed to fetch playlists' });
    }
});

/**
 * Fetches all songs from the database.
 *
 * @route GET /api/songs
 * @returns {Array<Object>} - An array of song objects.
 *
 * @example
 * // Request URL:
 * GET /api/songs
 *
 * // Successful response example:
 * [
 *   {
 *     "id": "64e3f1bc9f12a61d2c5a4c56",
 *     "title": "Song Title 1",
 *     "artist": "Artist Name 1",
 *     "link": "spotify.com/song1",
 *     "genre": "Pop"
 *   },
 *   {
 *     "id": "64e3f1bc9f12a61d2c5a4c57",
 *     "title": "Song Title 2",
 *     "artist": "Artist Name 2",
 *     "link": "spotify.com/song2",
 *     "genre": "Rock"
 *   }
 * ]
 *
 * @throws {Error} - Returns a 500 status code if there's an issue fetching the songs.
 * @returns {Array<Object>} - An array of formatted song objects, or a 404 error if no songs are found.
 */
userRoutes.get('/songs', async (req, res) => {
    try {
        const songs = await Song.find({}).exec();

        if (songs && songs.length > 0) {

            const formattedSongs = songs.map(song => ({
                id: song._id.toString(),
                title: song.title,
                artist: song.artist,
                link: song.link,
                genre: song.genre
            }));
            res.status(200).json(formattedSongs);  // Return songs as JSON
        } else {
            res.status(404).json({ message: 'No songs found' });
        }
    } catch (error) {
        console.error("Error fetching songs:", error);
        res.status(500).json({ error: 'Failed to fetch songs' });
    }
});

/**
 * Fetches the playlist based on an ID, including associated user details and comments.
 * Each comment will also include user details of the commenter.
 *
 * @route GET /api/playlists/:playlistId
 * @param {string} req.params.playlistId - The ID of the playlist to retrieve.
 * @returns {Object} - A playlist object containing the playlist's details,
 *                     associated user data, and an array of comments with user details.
 *
 * @example
 * // Request URL:
 * GET /api/playlists/64d9bdf13f08e64b0f9a1234
 *
 * // Successful response example:
 * {
 *   "id": "64d9bdf13f08e64b0f9a1234",
 *   "userId": "64d9bc7313f1e67b0f9a5678",
 *   "coverImage": "cover-image-url.jpg",
 *   "date_created": "2024-01-01T12:00:00.000Z",
 *   "genre": "Pop",
 *   "name": "Chill Vibes",
 *   "description": "Relaxing pop hits",
 *   "hashtags": ["#chill", "#vibes"],
 *   "songs": ["song1", "song2"],
 *   "user": {
 *      "_id": "64d9bc7313f1e67b0f9a5678",
 *      "username": "user123",
 *      "email": "user123@example.com",
 *      ...
 *   },
 *   "comments": [
 *     {
 *       "_id": "64da3f9c33abc7890a0f9c12",
 *       "playlistId": "64d9bdf13f08e64b0f9a1234",
 *       "userId": "64d9bc7313f1e67b0f9a5678",
 *       "content": "Great playlist!",
 *       "user": {
 *         "_id": "64d9bc7313f1e67b0f9a5678",
 *         "username": "commenterUser",
 *         "email": "commenter@example.com"
 *       }
 *     }
 *   ]
 * }
 *
 * @throws {Error} - Returns a 500 status code if there's an issue retrieving the playlist or comments.
 * @returns {Object} - The formatted playlist object with the associated user and comments data.
 */
userRoutes.get('/playlists/:playlistId', async (req, res) => {
    const  {playlistId} = req.params;
    try {
        const playlist = await Playlist.findById(playlistId).exec();
        const genres = await Genre.find().exec();
        if (playlist && genres) {
            const genre_name = genres.find(g => g._id.toString() === playlist.genre.toString());
            let formattedPlaylist = {
                id: playlist._id.toString(),
                userId: playlist.userId,
                coverImage: playlist.coverImage,
                date_created: playlist.date_created,
                genre: genre_name.name,
                name: playlist.name,
                description: playlist.description,
                hashtags: playlist.hashtags,
                songs: playlist.songs
            };

            const user = await User.findById(playlist.userId).exec();
            if (user) {
                formattedPlaylist.user = user;
            } else {
                formattedPlaylist.user = null;
            }

            const comments = await Comment.find({ playlistId }).exec();

            const commentsWithUser = await Promise.all(comments.map(async (comment) => {
                const commentUser = await User.findById(comment.userId).exec();
                return {
                    ...comment.toObject(),
                    user: commentUser ? commentUser : null
                };
            }));
            commentsWithUser.sort((a, b) => {
                const [dayA, monthA, yearA] = a.date.split('/').map(Number);
                const [dayB, monthB, yearB] = b.date.split('/').map(Number);
                const dateA = new Date(`20${yearA}-${monthA}-${dayA}`);
                const dateB = new Date(`20${yearB}-${monthB}-${dayB}`);
                return dateB - dateA;
            });
            formattedPlaylist.comments = commentsWithUser;


            return res.status(200).json(formattedPlaylist);
        } else {
            res.status(404).json({ message: 'No playlist found' });
        }
    } catch (error) {
        console.error("Error fetching playlist:", error);
        res.status(500).json({ error: 'Failed to fetch playlist' });
    }
});

/**
 * Find a user by their email.
 *
 * This route retrieves a user based on their email address. If the user is found,
 * it returns a formatted object excluding the password for security purposes.
 *
 * @route GET /api/user/email/:email
 * @param {string} req.params.email - The email of the user to retrieve.
 * @returns {Object} - The user object excluding the password, or an error message if the user is not found.
 * @throws {Error} - Returns an error if the user retrieval fails.
 *
 * @example
 * // Request URL example:
 * GET /api/user/email/johndoe@example.com
 *
 * // Successful response:
 * {
 *   "id": "60f9cfcf123abc124ef9d28",
 *   "username": "johndoe",
 *   "email": "johndoe@example.com",
 *   "password": "",
 *   "profile_picture": "profile-pic-url",
 *   "followers": [],
 *   "following": [],
 *   "playlists_created": [],
 *   "playlists_saved": [],
 *   "description": "This is John Doe's profile."
 * }
 *
 * @param {string} email - The email of the user to be found.
 * @returns {Promise<Object>} - The formatted user object excluding the password.
 * @throws {Error} - Throws an error if the retrieval fails.
 */
userRoutes.get('/user/email/:email', async (req, res) => {
    try {
        const { email } = req.params;
        console.log('Searching for user with email:', email);
        const user = await User.findOne({ email }).exec();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }else{
            const formatted = {
                id: user._id.toString(),
                username: user.username,
                email:user.email,
                password: '',
                profile_picture: user.profile_picture,
                followers: user.followers,
                following:user.following,
                playlists_created: user.playlists_created,
                playlists_saved: user.playlists_saved,
                description: user.description
            };
            res.status(200).json(formatted);
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Updates the following/follower arrays for two users.
 *
 * This route allows a user to follow another user. The current user's following array
 * is updated with the followed user's ID, and the followed user's followers array is updated
 * with the current user's ID.
 *
 * @route PATCH /api/users/:id/follow
 * @param {string} req.params.id - The ID of the current user (user1) who is following another user.
 * @param {string} req.body.followedUserId - The ID of the followed user (user2).
 * @returns {Object} - The updated user1 and user2 objects after following is updated.
 * @throws {Error} - Returns an error message if the update fails.
 *
 * @example
 * // Request body example:
 * {
 *   "followedUserId": "60f9cfcf123abc124ef9d29"
 * }
 *
 * // Successful response:
 * {
 *   "message": "Following updated successfully",
 *   "user1": {
 *     "_id": "60f9cfcf123abc124ef9d28",
 *     "username": "user1",
 *     "following": ["60f9cfcf123abc124ef9d29"],
 *     "followers": []
 *   },
 *   "user2": {
 *     "_id": "60f9cfcf123abc124ef9d29",
 *     "username": "user2",
 *     "following": [],
 *     "followers": ["60f9cfcf123abc124ef9d28"]
 *   }
 * }
 *
 * @param {string} userId - The ID of the current user (user1) who wants to follow another user.
 * @param {string} followedUserId - The ID of the user (user2) being followed.
 * @returns {Promise<Object>} - Returns a success message and the updated user1 and user2 objects.
 * @throws {Error} - Throws an error if the following/follower update fails.
 */
userRoutes.patch('/users/:id/follow', async (req, res) => {
    try {
        const userId = req.params.id;
        const { followedUserId } = req.body;

        // Find the current user (user1)
        const user1 = await User.findById(userId).exec();
        // Find the followed user (user2)
        const user2 = await User.findById(followedUserId).exec();

        if (!user1 || !user2) {
            return res.status(404).json({ message: 'One or both users not found' });
        }

        // Check if user1 is already following user2
        if (!user1.following.includes(followedUserId)) {
            user1.following.push(followedUserId);
        }

        // Check if user2 already has user1 in their followers
        if (!user2.followers.includes(userId)) {
            user2.followers.push(userId);
        }

        // Save both user1 and user2
        await user1.save();
        await user2.save();

        // Return the updated user1 object
        res.status(200).json({
            message: 'Following updated successfully',
            user1: user1 ,
            user2: user2
        });
    } catch (error) {
        console.error('Error updating following:', error.message);
        res.status(500).json({ message: 'Error updating following', error: error.message });
    }
});

/**
 * Fetches playlists based on an array of playlist IDs.
 *
 * This route retrieves multiple playlists by their IDs, provided in the request body.
 * It returns the playlist data in a formatted array, including relevant playlist details.
 *
 * @route POST /api/playlists
 * @param {Array<string>} req.body.playlistIds - The array of playlist IDs to retrieve.
 * @returns {Array<Object>} - A formatted array of playlist objects.
 * @throws {Error} - Returns an error message if the retrieval fails.
 *
 * @example
 * // Request body example:
 * {
 *   "playlistIds": ["60f9cfcf123abc124ef9d29", "60f9d0f123abdef1250aa29"]
 * }
 *
 * // Successful response:
 * [
 *   {
 *     "id": "60f9cfcf123abc124ef9d29",
 *     "userId": "60f9abc124ef9d29e9a1",
 *     "coverImage": "http://imageurl.com/cover1.jpg",
 *     "date_created": "2024-09-10",
 *     "genre": "Pop",
 *     "name": "Chill Vibes",
 *     "description": "A chill playlist for relaxed evenings",
 *     "hashtags": ["#chill", "#relax"],
 *     "songs": ["songId1", "songId2"]
 *   },
 *   {
 *     "id": "60f9d0f123abdef1250aa29",
 *     "userId": "60f9abc124ef9d29e9b2",
 *     "coverImage": "http://imageurl.com/cover2.jpg",
 *     "date_created": "2024-09-11",
 *     "genre": "Rock",
 *     "name": "Rock On",
 *     "description": "Energetic rock songs to boost your mood",
 *     "hashtags": ["#rock", "#energy"],
 *     "songs": ["songId3", "songId4"]
 *   }
 * ]
 *
 * @param {Array<string>} playlistIds - An array of playlist IDs to retrieve.
 * @returns {Promise<Array>} - A list of formatted playlist objects.
 * @throws {Error} - Throws an error if fetching playlists fails.
 */
userRoutes.post('/playlists', async (req, res) => {

    const { playlistIds } = req.body;
    if(playlistIds.length === 0){
        res.status(200).json(playlistIds);
    } else{
        try {
            const playlists = await Playlist.find({
                _id: { $in: playlistIds }
            }).exec();
            const genres = await Genre.find().exec();
            if (playlists && playlists.length > 0) {
                const formatted = playlists.map(playlist => {
                const genre_name = genres.find(g => g._id.toString() === playlist.genre.toString());
                return {
                    id: playlist._id.toString(),  
                    userId: playlist.userId,
                    coverImage: playlist.coverImage,
                    date_created: playlist.date_created,
                    genre: genre_name.name, 
                    name: playlist.name,
                    description: playlist.description,
                    hashtags: playlist.hashtags,
                    songs: playlist.songs
                };
            });
                res.status(200).json(formatted);
            }
        } catch (error) {
            res.status(500).json({ message: 'Error fetching playlists', error: error.message });
        }
    }

});

/**
 * Fetch all comments associated with a playlist and include user information for each comment.
 *
 * This route retrieves all comments related to a specific playlist by its ID. Each comment
 * is enriched with the associated user data (if available) and returned in the response.
 *
 * @route GET /api/comments/:playlistId
 * @param {string} req.params.playlistId - The ID of the playlist for which comments are being fetched.
 * @returns {Array<Object>} - An array of comment objects with user information added.
 * @throws {Error} - Returns an error message if the retrieval fails.
 *
 * @example
 * // Successful response:
 * [
 *   {
 *     "_id": "60f9cfcf123abc124ef9d29",
 *     "content": "Great playlist!",
 *     "userId": "60f9abc124ef9d29e9a1",
 *     "date": "2024-09-10",
 *     "playlistId": "0121441",
 *     "user": {
 *       "_id": "60f9abc124ef9d29e9a1",
 *       "username": "john_doe",
 *       "email": "john@example.com"
 *     }
 *   },
 *   {
 *     "_id": "60f9d0f123abdef1250aa29",
 *     "content": "Love the vibe!",
 *     "userId": "60f9abc124ef9d29e9b2",
 *     "date": "2024-09-11",
 *     "playlistId": "0121441",
 *     "user": {
 *       "_id": "60f9abc124ef9d29e9b2",
 *       "username": "jane_doe",
 *       "email": "jane@example.com"
 *     }
 *   }
 * ]
 *
 * @param {string} playlistId - The ID of the playlist for which comments are being fetched.
 * @returns {Promise<Array>} - A list of comments, each containing associated user details.
 * @throws {Error} - Throws an error if fetching comments or user details fails.
 */
userRoutes.get('/comments/:playlistId', async (req, res) => {
    const { playlistId } = req.params;
    //console.log("Getting comments for ",playlistId);
    try {
        const comments = await Comment.find({ playlistId }).exec();
        if (comments.length === 0) {
            res.status(200).json(comments);
        } else{
            // Loop through each comment and fetch associated user data
            //console.log(comments);
            const commentsWithUser = await Promise.all(comments.map(async (comment) => {
                const user = await User.findById(comment.userId).exec();
                return {
                    ...comment.toObject(),
                    user: user ? user : null
                };
            }));
            commentsWithUser.sort((a, b) => {
                const [dayA, monthA, yearA] = a.split('/').map(Number);
                const [dayB, monthB, yearB] = b.split('/').map(Number);
                const dateA = new Date(2000 + yearA, monthA - 1, dayA);
                const dateB = new Date(2000 + yearB, monthB - 1, dayB);
                return dateA - dateB;
            });
            res.status(200).json(commentsWithUser);
        }

    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * Update the songs array of a playlist.
 *
 * This route updates the song list of a specific playlist by its ID. It replaces the existing song array
 * with the new array of songs provided in the request body.
 *
 * @route PUT /api/addSong/:playlistId
 * @param {string} req.params.playlistId - The ID of the playlist to update.
 * @param {Array<string>} req.body.songs - An array of song IDs to be added to the playlist.
 * @returns {Object} - The updated playlist object with its new songs array.
 * @throws {Error} - Returns an error message if the update fails.
 *
 * @example
 * // Request body:
 * {
 *   "songs": ["60e9fbcf9b1e8d24d4f7d4b9", "60e9fbcf9b1e8d24d4f7d4c0"]
 * }
 *
 * // Successful response:
 * {
 *   "_id": "60e9fbcf9b1e8d24d4f7d4b8",
 *   "name": "Chill Vibes",
 *   "songs": ["60e9fbcf9b1e8d24d4f7d4b9", "60e9fbcf9b1e8d24d4f7d4c0"],
 *   "userId": "60e9fbcf9b1e8d24d4f7d4a7",
 *   "date_created": "2024-09-10"
 * }
 *
 * @param {string} playlistId - The ID of the playlist to update.
 * @param {Array<string>} songs - The new array of song IDs to be added to the playlist.
 * @returns {Promise<Object>} - The updated playlist object containing the updated songs array.
 * @throws {Error} - Throws an error if the update fails due to invalid ID or internal server issues.
 */
userRoutes.put('/addSong/:playlistId', async (req, res) => {
    const { playlistId } = req.params;
    const { songs } = req.body;

    console.log(`Received request to update playlist with ID: ${playlistId}`);

    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        console.error('Invalid playlist ID format:', playlistId);
        return res.status(400).json({ message: 'Invalid playlist ID format.' });
    }

    if (!Array.isArray(songs)) {
        console.error('Songs must be an array:', songs);
        return res.status(400).json({ message: 'Songs must be an array.' });
    }

    try {
        const updatedPlaylist = await Playlist.findByIdAndUpdate(
            playlistId,
            { songs },
            { new: true, runValidators: true }
        );

        if (!updatedPlaylist) {
            return res.status(404).json({ message: 'Playlist not found.' });
        }

        res.json(updatedPlaylist);
    } catch (error) {
        console.error('Error updating playlist songs:', error);
        res.status(500).json({ message: 'Failed to update playlist songs.' });
    }
});

/**
 * Fetches songs based on an array of song IDs.
 *
 * This route retrieves songs from the database that match the provided song IDs in the request body.
 * It responds with a formatted array of song objects containing details like title, artist, and Spotify link.
 *
 * @route POST /api/songsInPlaylist
 * @param {Array<string>} req.body.songIds - An array of song IDs to retrieve from the database.
 * @returns {Array<Object>} - An array of formatted song objects, each containing:
 *   - {string} id - The ID of the song.
 *   - {string} title - The title of the song.
 *   - {string} artist - The artist of the song.
 *   - {string} link - The Spotify link of the song.
 *   - {string} genre - The genre of the song.
 * @throws {Error} - Returns an error message if song retrieval fails.
 *
 * @example
 * // Request body:
 * {
 *   "songIds": ["60e9fbcf9b1e8d24d4f7d4b9", "60e9fbcf9b1e8d24d4f7d4c0"]
 * }
 *
 * // Successful response:
 * [
 *   {
 *     "id": "60e9fbcf9b1e8d24d4f7d4b9",
 *     "title": "Song 1",
 *     "artist": "Artist 1",
 *     "link": "https://spotify.com/song1",
 *     "genre": "Pop"
 *   },
 *   {
 *     "id": "60e9fbcf9b1e8d24d4f7d4c0",
 *     "title": "Song 2",
 *     "artist": "Artist 2",
 *     "link": "https://spotify.com/song2",
 *     "genre": "Rock"
 *   }
 * ]
 */
userRoutes.post('/songsInPlaylist', async (req, res) => {
    const { songIds } = req.body;
    if(songIds.length === 0){
        res.status(200).json(songIds);
    } else{
        try {
            const songs = await Song.find({
                _id: { $in: songIds }
            }).exec();

            if (songs && songs.length > 0) {
                const formattedSongs = songs.map(song => ({
                    id: song._id.toString(),
                    title: song.title,
                    artist: song.artist,
                    link: song.link,
                    genre: song.genre
                }));
                res.status(200).json(formattedSongs);
            }
        } catch (error) {
            res.status(500).json({ message: 'Error fetching songs', error: error.message });
        }
    }

});

/**
 * Updates the details of a playlist by its ID.
 *
 * @route PUT /api/update/playlist/:id
 * @param {string} id - The ID of the playlist to update.
 * @param {Object} req.body - The details to update for the playlist.
 * @param {string} [req.body.name] - The new name of the playlist (optional).
 * @param {string} [req.body.description] - The new description of the playlist (optional).
 * @param {string} [req.body.genre] - The genre of the playlist (optional).
 * @param {string} [req.body.coverImage] - The new cover image URL for the playlist (optional).
 * @param {string[]} [req.body.hashtags] - An array of new hashtags associated with the playlist (optional).
 * @returns {Object} - Returns the updated playlist object if successful.
 * @throws {Error} - Returns a 404 status code if the playlist is not found or a 500 status code for server errors.
 *
 * @example
 * // PUT /api/update/playlist/641e3c1f2f18b1112bdae117
 * // Request body:
 * {
 *   "name": "My Updated Playlist",
 *   "description": "Updated playlist description",
 *   "genre": "Pop",
 *   "hashtags": ["chill", "summer", "vibes"],
 *   "coverImage": "newCoverImage.jpg"
 * }
 *
 * // Successful response example:
 * {
 *   "_id": "641e3c1f2f18b1112bdae117",
 *   "name": "My Updated Playlist",
 *   "description": "Updated playlist description",
 *   "genre": "Pop",
 *   "hashtags": ["chill", "summer", "vibes"],
 *   "coverImage": "newCoverImage.jpg",
 *   "createdAt": "2024-09-10T14:23:17.239Z",
 *   "updatedAt": "2024-09-11T11:45:39.732Z",
 *   "__v": 0
 * }
 *
 * @example
 * // Error response example (Playlist not found):
 * {
 *   "message": "Playlist not found"
 * }
 *
 * @example
 * // Error response example (Server error):
 * {
 *   "message": "Server error"
 * }
 */
userRoutes.put('/update/playlist/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description,genre, hashtags,coverImage } = req.body;


    try {
        const updatePlaylist = await Playlist.findByIdAndUpdate(id, {
            name,
            description,
            genre,
            hashtags,
            coverImage
        }, { new: true });

        if (!updatePlaylist) {
            return res.status(404).json({ message: "Playlist not found" });
        }

        res.json(updatePlaylist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

/**
* Updates the saved playlists of a user by adding or removing a playlist ID.
*
* @route PUT /api/user/:userId/save-playlist
* @param {string} userId - The ID of the user whose playlists are being updated.
* @param {string} req.body.playlistId - The ID of the playlist to add or remove from the user's saved playlists.
* @returns {Object} - The updated user object with the modified playlists_saved array.
* @throws {Error} - Returns a 404 status code if the user is not found or a 500 status code for server errors.
*/
userRoutes.put('/user/:userId/save-playlist', async (req, res) => {
    const { userId } = req.params;
    const { playlistId } = req.body;

    try {
        const user = await User.findById(userId).exec();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const index = user.playlists_saved.indexOf(playlistId);
        if (index === -1) {
            // Playlist not saved -> add it
            user.playlists_saved.push(playlistId);
        } else {
            // Playlist is already saved -> remove it
            user.playlists_saved.splice(index, 1);
        }

        await user.save();

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * Creates a new playlist for a user.
 *
 * @route POST /api/add/playlist/:userId
 * @param {Object} req.body - The details for the new playlist.
 * @param {string} req.body.name - The name of the new playlist.
 * @param {string} req.body.date_created - The date the playlist was created.
 * @param {string} req.body.genre - The genre of the playlist.
 * @param {string} req.body.description - The description of the playlist.
 * @param {Array} req.body.hashtags - The hashtags for the playlist.
 * @param {Array} req.body.songs - The list of songs in the playlist.
 * @param {string} [req.body.coverImage] - The cover image URL for the playlist.
 * @returns {Object} - The newly created playlist object and the updated user object.
 * @throws {Error} - Returns a 400 status code for validation or creation errors.
 *
 * @example
 * // Successful response example:
 * {
 *   "playlist": {
 *     "_id": "64e3f1bc9f12a61d2c5a4c58",
 *     "name": "My Playlist",
 *     "date_created": "10/09/2024",
 *     "genre": "Pop",
 *     "description": "Best Pop Songs",
 *     "hashtags": ["pop", "hits"],
 *     "songs": ["song1", "song2"],
 *     "coverImage": "image.jpg"
 *   },
 *   "user": {
 *     "_id": "64e3f1bc9f12a61d2c5a4c58",
 *     "playlists_created": ["64e3f1bc9f12a61d2c5a4c58"]
 *   }
 * }
 *
 * @example
 * // Error response example:
 * {
 *   "message": "User not found"
 * }
 */
userRoutes.post('/add/playlist/:userId', async (req, res) => {
    try {
        const { userId ,coverImage,date_created, genre,name, description, hashtags, songs} = req.body;
        console.log(req.body);

        const newPlaylist = new Playlist({
            userId,
            coverImage,
            date_created,
            genre,
            name,
            description,
            hashtags,
            songs
        });

        console.log(newPlaylist);
        await newPlaylist.save();

        const user = await User.findById(userId).exec();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.playlists_created.push(newPlaylist._id);
        await user.save();

        res.status(201).json({ playlist: newPlaylist, user: user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * Adds a new song to the database.
 *
 * @route POST /api/add/song
 * @param {Object} req.body - The details for the new song.
 * @param {string} req.body.title - The title of the new song.
 * @param {string} req.body.artist - The artist of the new song.
 * @param {string} req.body.link - The URL link to the song.
 * @param {string} req.body.genre - The genre of the song.
 * @returns {Object} - The newly created song object.
 * @throws {Error} - Returns a 400 status code for validation or creation errors.
 *
 * @example
 * // Successful response example:
 * {
 *   "title": "Song Title",
 *   "artist": "Artist Name",
 *   "link": "https://linktosong.com",
 *   "genre": "Pop",
 *   "_id": "64e3f1bc9f12a61d2c5a4c58"
 * }
 *
 * @example
 * // Error response example:
 * {
 *   "message": "Error creating song"
 * }
 */
userRoutes.post('/add/song', async (req, res) => {
    try {
        const { title, artist, link, genre } = req.body;
        console.log(req.body);

        const newSong = new Song({
            title,
            artist,
            link,
            genre,
        });

        await newSong.save();
        res.status(201).json(newSong);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * Removes a song from a playlist's songs array.
 *
 * @route DELETE /api/playlist/:playlistId/song/:songId
 * @param {string} req.params.playlistId - The ID of the playlist.
 * @param {string} req.params.songId - The ID of the song to be removed.
 * @returns {Object} - The updated playlist object.
 * @throws {Error} - Returns a 404 status code if the playlist or song is not found.
 *
 * @example
 * // Successful response example:
 * {
 *   "playlist": {
 *     "_id": "64e3f1bc9f12a61d2c5a4c58",
 *     "name": "My Playlist",
 *     "songs": ["song1", "song3"] // song2 has been removed
 *   }
 * }
 *
 * @example
 * // Error response example:
 * {
 *   "message": "Playlist or song not found"
 * }
 */
userRoutes.delete('/playlist/:playlistId/song/:songId', async (req, res) => {
    try {
        const { playlistId, songId } = req.params;

        const playlist = await Playlist.findByIdAndUpdate(
            playlistId, 
            { $pull: { songs: songId } }, 
            { new: true } 
        ).exec();

        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }
        const genres = await Genre.find().exec();
        if (playlist && genres) {
            const genre_name = genres.find(g => g._id.toString() === playlist.genre.toString());
            let formattedPlaylist = {
                id: playlist._id.toString(),
                userId: playlist.userId,
                coverImage: playlist.coverImage,
                date_created: playlist.date_created,
                genre: genre_name.name,
                name: playlist.name,
                description: playlist.description,
                hashtags: playlist.hashtags,
                songs: playlist.songs
            };

            const user = await User.findById(playlist.userId).exec();
            if (user) {
                formattedPlaylist.user = user;
            } else {
                formattedPlaylist.user = null;
            }

            const comments = await Comment.find({ playlistId }).exec();

            const commentsWithUser = await Promise.all(comments.map(async (comment) => {
                const commentUser = await User.findById(comment.userId).exec();
                return {
                    ...comment.toObject(),
                    user: commentUser ? commentUser : null
                };
            }));

            formattedPlaylist.comments = commentsWithUser;
            return res.status(200).json(formattedPlaylist);
        }
    } catch (error) {
        console.error('Error removing song from playlist:', error);
        res.status(500).json({ message: 'Failed to remove song from playlist' });
    }
});

/**
 * Removes a follower from a user's following array.
 *
 * @route DELETE /api/user/:userId/follower/:followerId
 * @param {string} req.params.userId - The ID of the user.
 * @param {string} req.params.followerId - The ID of the follower to be removed.
 * @returns {Object} - The updated user object.
 * @throws {Error} - Returns a 404 status code if the user or follower is not found.
 *
 * @example
 * // Successful response example:
 * {
 *   "user": {
 *     "_id": "64e3f1bc9f12a61d2c5a4c58",
 *     "username": "My Playlist",
 *     "email": "Some@email.com",
 *     "profile_picture":"https://someImage.png",
 *     "followers" : [id1,id2],
 *     "following":[id3,id4],
 *     "playlists_created":[id1,id2],
 *     "playlists_saved":[id1,id2],
 *     "description": "some description"
 *   }
 * }
 *
 * @example
 * // Error response example:
 * {
 *   "message": "user or follower not found"
 * }
 */
userRoutes.delete('/user/:userId/follower/:followerId', async (req, res) => {
    try {
        const { userId, followerId } = req.params;

        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { following: followerId } },
            { new: true }
        ).exec();

        const follower = await User.findByIdAndUpdate(
            followerId,
            { $pull: { followers: userId } },
            { new: true }
        ).exec();

        if (!user || !follower) {
            return res.status(404).json({ message: 'User or follower not found' });
        }

        if (user && follower) {
            return res.status(200).json(user);
        }
    } catch (error) {
        console.error(`Error removing follower from user's following list:`, error);
        res.status(500).json({ message: 'Failed to remove follower from user follower list' });
    }
});

/**
 * Fetches playlists based on an array of user IDs.
 *
 * This route retrieves multiple playlists created by the provided user IDs.
 * It returns the playlist data in a formatted array, including relevant playlist details.
 *
 * @route POST /api/playlists/by-users
 * @param {Array<string>} req.body.userIds - The array of user IDs to retrieve playlists for.
 * @returns {Array<Object>} - A formatted array of playlist objects.
 * @throws {Error} - Returns an error message if the retrieval fails.
 *
 * @example
 * // Request body example:
 * {
 *   "userIds": ["60f9abc124ef9d29e9a1", "60f9abc124ef9d29e9b2"]
 * }
 *
 * // Successful response:
 * [
 *   {
 *     "id": "60f9cfcf123abc124ef9d29",
 *     "userId": "60f9abc124ef9d29e9a1",
 *     "coverImage": "http://imageurl.com/cover1.jpg",
 *     "date_created": "2024-09-10",
 *     "genre": "Pop",
 *     "name": "Chill Vibes",
 *     "description": "A chill playlist for relaxed evenings",
 *     "hashtags": ["#chill", "#relax"],
 *     "songs": ["songId1", "songId2"]
 *   },
 *   {
 *     "id": "60f9d0f123abdef1250aa29",
 *     "userId": "60f9abc124ef9d29e9b2",
 *     "coverImage": "http://imageurl.com/cover2.jpg",
 *     "date_created": "2024-09-11",
 *     "genre": "Rock",
 *     "name": "Rock On",
 *     "description": "Energetic rock songs to boost your mood",
 *     "hashtags": ["#rock", "#energy"],
 *     "songs": ["songId3", "songId4"]
 *   }
 * ]
 */
userRoutes.post('/playlists/by-users', async (req, res) => {
    const { userIds } = req.body;

    if (!userIds || userIds.length === 0) {
        return res.status(400).json({ message: 'User IDs are required' });
    }

    try {
        const playlists = await Playlist.find({
            userId: { $in: userIds }
        }).exec();

        const genres = await Genre.find().exec();

        if (playlists.length === 0) {
            return res.status(404).json({ message: 'No playlists found for the provided user IDs' });
        }

        const formatted = playlists.map(playlist => {
            const genre_name = genres.find(g => g._id.toString() === playlist.genre.toString());

            return {
                id: playlist._id.toString(),
                userId: playlist.userId,
                coverImage: playlist.coverImage,
                date_created: playlist.date_created,
                genre: genre_name ? genre_name.name : 'Unknown',
                name: playlist.name,
                description: playlist.description,
                hashtags: playlist.hashtags,
                songs: playlist.songs
            };
        });
        //console.log(formatted);
        res.status(200).json(formatted);
    } catch (error) {
        console.error('Error fetching playlists by user IDs:', error);
        res.status(500).json({ message: 'Error fetching playlists', error: error.message });
    }
});

/**
 * Deletes a playlist by its ID.
 *
 * This route deletes the playlist and removes it from the user's created playlists.
 * Additionally, it removes the playlist from any user's saved playlists.
 *
 * @route DELETE /api/playlists/:playlistId
 * @param {string} req.params.playlistId - The ID of the playlist to delete.
 * @returns {Object} - Success message if the playlist was deleted successfully.
 * @throws {Error} - Returns an error message if the deletion fails.
 *
 * @example
 * // Request URL example:
 * DELETE /api/playlists/60f9d0f123abdef1250aa29
 *
 * // Successful response:
 * {
 *   "message": "Playlist deleted successfully"
 * }
 *
 * @example
 * // Error response example:
 * {
 *   "message": "Error deleting playlist"
 * }
 */
userRoutes.delete('/playlists/:playlistId', async (req, res) => {
    const { playlistId } = req.params;

    try {
        const playlist = await Playlist.findById(playlistId);

        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        const { userId } = playlist;
        await Playlist.findByIdAndDelete(playlistId);
        await User.findByIdAndUpdate(userId, {
            $pull: { playlists_created: playlistId }
        });
        await User.updateMany(
            { playlists_saved: playlistId },
            { $pull: { playlists_saved: playlistId } }
        );

        res.status(200).json({ message: 'Playlist deleted successfully' });
    } catch (error) {
        console.error('Error deleting playlist:', error);
        res.status(500).json({ message: 'Error deleting playlist', error: error.message });
    }
});

/**
 * Add a comment to a specific playlist.
 *
 * This route allows users to add a comment to a playlist by providing the playlist ID,
 * comment content, and the user ID. The new comment is saved in the database and returned
 * in the response.
 *
 * @route POST /api/comments/:playlistId
 * @param {string} req.params.playlistId - The ID of the playlist to which the comment is added.
 * @param {Object} req.body - The comment data.
 * @param {string} req.body.content - The content of the comment.
 * @param {string} req.body.userId - The ID of the user adding the comment.
 * @returns {Object} - The newly created comment object.
 * @throws {Error} - Returns an error message if the creation fails.
 */
userRoutes.post('/comments/:playlistId', async (req, res) => {
    const { playlistId } = req.params;
    const { content, userId } = req.body;

    if (!content || !userId) {
        return res.status(400).json({ message: 'Content and userId are required.' });
    }

    const date = new Date();
    const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear().toString().slice(-2)}`;

    const newComment = new Comment({
        content,
        userId,
        playlistId,
        date: formattedDate,
    });

    try {
        const savedComment = await newComment.save();
        res.status(201).json(savedComment);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = userRoutes;
