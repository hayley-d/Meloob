const express = require('express');
const User = require('./models/User');
const Genre = require('./models/Genre');
const Admin = require('./models/AdminUser');
const Playlist = require('./models/Playlist');
const Comment = require('./models/Comment');
const Song = require('./models/Song');
const argon2 = require('argon2');
const {MongoClient, ObjectId} = require('mongodb');
const {mongoose} = require('mongoose');
/**
 * @file userApi.js
 * @description Handles all user-related API routes and logic.
 */

const userRoutes = express.Router();

/**
 * @swagger
 * /api/genres:
 *   get:
 *     summary: Retrieves a list of all genres
 *     tags: [Genres]
 *     responses:
 *       200:
 *         description: An array of genre objects.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The unique identifier for the genre.
 *                   name:
 *                     type: string
 *                     description: The name of the genre.
 *         examples:
 *           application/json:
 *             value: [
 *               {
 *                 "id": "64e3f1bc9f12a61d2c5a4c58",
 *                 "name": "genre1"
 *               },
 *               {
 *                 "id": "64e3f1bc9f12a61d2c5a4c59",
 *                 "name": "genre2"
 *               }
 *             ]
 *       400:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *             examples:
 *               application/json:
 *                 value: {
 *                   "error": "Failed to fetch genres"
 *                 }
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
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieves a list of all users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: An array of user objects.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The unique identifier for the user.
 *                   username:
 *                     type: string
 *                     description: The username of the user.
 *                   email:
 *                     type: string
 *                     description: The email address of the user.
 *                   followers:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: List of follower IDs.
 *                   following:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: List of IDs of users this user is following.
 *                   playlists_created:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: List of playlist IDs created by the user.
 *                   playlists_saved:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: List of playlist IDs saved by the user.
 *                   description:
 *                     type: string
 *                     description: Optional description or bio for the user.
 *         examples:
 *           application/json:
 *             value: [
 *               {
 *                 "id": "64e3f1bc9f12a61d2c5a4c58",
 *                 "username": "user123",
 *                 "email": "user@example.com",
 *                 "followers": ["64e3f1bc9f12a61d2c5a4c57"],
 *                 "following": ["64e3f1bc9f12a61d2c5a4c59"],
 *                 "playlists_created": ["64e3f1bc9f12a61d2c5a4c5a"],
 *                 "playlists_saved": ["64e3f1bc9f12a61d2c5a4c5b"],
 *                 "description": "User bio goes here."
 *               }
 *             ]
 *       400:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *             examples:
 *               application/json:
 *                 value: {
 *                   "error": "Failed to fetch users"
 *                 }
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
 * @swagger
 * /api/admins/{userId}:
 *   get:
 *     summary: Checks if a user is an admin.
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user to check.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Indicates whether the user is an admin.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isAdmin:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Failed to check admin status.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to check admin status"
 */
userRoutes.get('/admins/:userId', async (req, res) => {
    try {
        const {userId} = req.params;

        const admin = await Admin.findOne({userId}).exec();

        if (admin) {

            res.status(200).json({isAdmin: true});
        } else {

            res.status(200).json({isAdmin: false});
        }
    } catch (error) {
        console.error("Error checking admin status:", error);
        res.status(500).json({error: 'Failed to check admin status'});
    }
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Retrieves a user by their ID
 *     tags: [User]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The user object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique identifier for the user.
 *                 username:
 *                   type: string
 *                   description: The username of the user.
 *                 email:
 *                   type: string
 *                   description: The email address of the user.
 *                 followers:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of follower IDs.
 *                 following:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of IDs of users this user is following.
 *                 playlists_created:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of playlist IDs created by the user.
 *                 playlists_saved:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of playlist IDs saved by the user.
 *                 description:
 *                   type: string
 *                   description: Optional description or bio for the user.
 *         examples:
 *           application/json:
 *             value: {
 *               "id": "64e3f1bc9f12a61d2c5a4c58",
 *               "username": "user123",
 *               "email": "user@example.com",
 *               "followers": ["64e3f1bc9f12a61d2c5a4c57"],
 *               "following": ["64e3f1bc9f12a61d2c5a4c59"],
 *               "playlists_created": ["64e3f1bc9f12a61d2c5a4c5a"],
 *               "playlists_saved": ["64e3f1bc9f12a61d2c5a4c5b"],
 *               "description": "User bio goes here."
 *             }
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *             examples:
 *               application/json:
 *                 value: {
 *                   "message": "No user found"
 *                 }
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 */
userRoutes.get('/users/:id', async (req, res) => {
    try {
        const objectId = new ObjectId(req.params.id);
        const user = await User.findById(objectId).exec();

        if (user) {

            const formatted = {
                id: user._id.toString(),
                username: user.username,
                email: user.email,
                password: user.password,
                profile_picture: user.profile_picture,
                followers: user.followers,
                following: user.following,
                playlists_created: user.playlists_created,
                playlists_saved: user.playlists_saved,
                description: user.description
            };

            res.status(200).json(formatted);
        } else {
            res.status(200).json({message: 'No user found'});
        }
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch user'});
    }
});

/**
 * @swagger
 * /api/playlists:
 *   get:
 *     summary: Fetches all playlists from the database.
 *     tags: [Playlist]
 *     responses:
 *       200:
 *         description: An array of formatted playlist objects.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The unique identifier for the playlist.
 *                   userId:
 *                     type: string
 *                     description: The ID of the user who created the playlist.
 *                   coverImage:
 *                     type: string
 *                     description: The URL of the playlist cover image.
 *                   date_created:
 *                     type: string
 *                     description: The date the playlist was created.
 *                   genre:
 *                     type: string
 *                     description: The genre of the playlist.
 *                   name:
 *                     type: string
 *                     description: The name of the playlist.
 *                   description:
 *                     type: string
 *                     description: A description of the playlist.
 *                   hashtags:
 *                     type: array
 *                     items:
 *                       type: string
 *                   songs:
 *                     type: array
 *                     items:
 *                       type: string
 *       404:
 *         description: No playlist found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
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
            res.status(404).json({message: 'No playlist found'});
        }
    } catch (error) {

        res.status(500).json({error: 'Failed to fetch playlists'});
    }
});

/**
 * @swagger
 * /api/songs:
 *   get:
 *     summary: Fetches all songs from the database.
 *     tags: [Songs]
 *     responses:
 *       200:
 *         description: An array of formatted song objects.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "64e3f1bc9f12a61d2c5a4c56"
 *                   title:
 *                     type: string
 *                     example: "Song Title 1"
 *                   artist:
 *                     type: string
 *                     example: "Artist Name 1"
 *                   link:
 *                     type: string
 *                     example: "spotify.com/song1"
 *                   genre:
 *                     type: string
 *                     example: "Pop"
 *       404:
 *         description: No songs found.
 *       500:
 *         description: Failed to fetch songs.
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
            res.status(200).json(formattedSongs);
        } else {
            res.status(200).json({message: 'No songs found'});
        }
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch songs'});
    }
});

/**
 * @swagger
 * /api/playlists/{playlistId}:
 *   get:
 *     summary: Fetches the playlist based on an ID.
 *     tags: [Playlists]
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         description: The ID of the playlist to retrieve.
 *         schema:
 *           type: string
 *           example: "64d9bdf13f08e64b0f9a1234"
 *     responses:
 *       200:
 *         description: A playlist object containing details, associated user data, and comments.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "64d9bdf13f08e64b0f9a1234"
 *                 userId:
 *                   type: string
 *                   example: "64d9bc7313f1e67b0f9a5678"
 *                 coverImage:
 *                   type: string
 *                   example: "cover-image-url.jpg"
 *                 date_created:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-01T12:00:00.000Z"
 *                 genre:
 *                   type: string
 *                   example: "Pop"
 *                 name:
 *                   type: string
 *                   example: "Chill Vibes"
 *                 description:
 *                   type: string
 *                   example: "Relaxing pop hits"
 *                 hashtags:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "#chill"
 *                 songs:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "song1"
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "64d9bc7313f1e67b0f9a5678"
 *                     username:
 *                       type: string
 *                       example: "user123"
 *                     email:
 *                       type: string
 *                       example: "user123@example.com"
 *                 comments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "64da3f9c33abc7890a0f9c12"
 *                       content:
 *                         type: string
 *                         example: "Great playlist!"
 *                       user:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "64d9bc7313f1e67b0f9a5678"
 *                           username:
 *                             type: string
 *                             example: "commenterUser"
 *                           email:
 *                             type: string
 *                             example: "commenter@example.com"
 *       404:
 *         description: No playlist found.
 *       500:
 *         description: Failed to fetch playlist.
 */
userRoutes.get('/playlists/:playlistId', async (req, res) => {
    const {playlistId} = req.params;
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

            const comments = await Comment.find({playlistId}).exec();

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
            res.status(404).json({message: 'No playlist found'});
        }
    } catch (error) {
        console.error("Error fetching playlist:", error);
        res.status(500).json({error: 'Failed to fetch playlist'});
    }
});

/**
 * @swagger
 * /api/user/email/{email}:
 *   get:
 *     summary: Find a user by their email.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: The email of the user to retrieve.
 *         schema:
 *           type: string
 *           example: "johndoe@example.com"
 *     responses:
 *       200:
 *         description: The user object excluding the password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "60f9cfcf123abc124ef9d28"
 *                 username:
 *                   type: string
 *                   example: "johndoe"
 *                 email:
 *                   type: string
 *                   example: "johndoe@example.com"
 *                 password:
 *                   type: string
 *                   example: ""
 *                 profile_picture:
 *                   type: string
 *                   example: "profile-pic-url"
 *                 followers:
 *                   type: array
 *                   items:
 *                     type: string
 *                 following:
 *                   type: array
 *                   items:
 *                     type: string
 *                 playlists_created:
 *                   type: array
 *                   items:
 *                     type: string
 *                 playlists_saved:
 *                   type: array
 *                   items:
 *                     type: string
 *                 description:
 *                   type: string
 *                   example: "This is John Doe's profile."
 *       404:
 *         description: User not found.
 *       500:
 *         description: Failed to retrieve user.
 */
userRoutes.get('/user/email/:email', async (req, res) => {
    try {
        const {email} = req.params;
        console.log('Searching for user with email:', email);
        const user = await User.findOne({email}).exec();

        if (!user) {
            return res.status(404).json({message: 'User not found'});
        } else {
            const formatted = {
                id: user._id.toString(),
                username: user.username,
                email: user.email,
                password: '',
                profile_picture: user.profile_picture,
                followers: user.followers,
                following: user.following,
                playlists_created: user.playlists_created,
                playlists_saved: user.playlists_saved,
                description: user.description
            };
            res.status(200).json(formatted);
        }

    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

/**
 * @swagger
 * /api/comments/{playlistId}:
 *   get:
 *     summary: Fetch all comments associated with a playlist.
 *     description: This route retrieves all comments related to a specific playlist by its ID. Each comment is enriched with the associated user data (if available) and returned in the response.
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         description: The ID of the playlist for which comments are being fetched.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: An array of comment objects with user information added.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   content:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   date:
 *                     type: string
 *                   playlistId:
 *                     type: string
 *                   user:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       username:
 *                         type: string
 *                       email:
 *                         type: string
 *       500:
 *         description: Error fetching comments.
 */
userRoutes.get('/comments/:playlistId', async (req, res) => {
    const {playlistId} = req.params;
    //console.log("Getting comments for ",playlistId);
    try {
        const comments = await Comment.find({playlistId}).exec();
        if (comments.length === 0) {
            res.status(200).json(comments);
        } else {
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
        res.status(500).json({message: 'Server error'});
    }
});

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Logs a user in by verifying their email and password.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user trying to log in.
 *               password:
 *                 type: string
 *                 description: The password of the user trying to log in.
 *           example:
 *             email: "user@example.com"
 *             password: "userPassword"
 *     responses:
 *       200:
 *         description: A response object with a success message and user details if login is successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Login success message.
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The unique identifier for the user.
 *                     username:
 *                       type: string
 *                       description: The username of the user.
 *                     email:
 *                       type: string
 *                       description: The email of the user.
 *                     profile_picture:
 *                       type: string
 *                       description: The URL of the user's profile picture.
 *                     followers:
 *                       type: array
 *                       items:
 *                         type: string
 *                     following:
 *                       type: array
 *                       items:
 *                         type: string
 *                     playlists_created:
 *                       type: array
 *                       items:
 *                         type: string
 *                     playlists_saved:
 *                       type: array
 *                       items:
 *                         type: string
 *                     description:
 *                       type: string
 *                       description: User's description.
 *                     isAdmin:
 *                       type: boolean
 *                       description: Indicates if the user is an admin.
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *             examples:
 *               application/json:
 *                 value: {
 *                   "message": "User not found"
 *                 }
 *       400:
 *         description: Invalid password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *             examples:
 *               application/json:
 *                 value: {
 *                   "message": "Invalid password"
 *                 }
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 */
userRoutes.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});

        if (!user) {
            return res.status(200).json({message: 'User not found'});
        }


        const isMatch = await argon2.verify(user.password, password);
        if (!isMatch) {
            return res.status(400).json({message: 'Invalid password'});
        }

        req.session.user = user;

        res.status(200).json({message: 'Login successful', user: user});

    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

/**
 * @swagger
 * /api/logout:
 *   post:
 *     summary: Logs a user out by destroying their session.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: A response object with a success message if logout is successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Logout success message.
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 */
userRoutes.post('/logout', (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({message: 'Failed to log out', error: err.message});
            }

            res.status(200).json({message: 'Logout successful'});
        });
    } catch (error) {
        res.status(500).json({message: 'Logout failed', error: error.message});
    }
});

/**
 * @swagger
 * /api/playlists:
 *   post:
 *     summary: Fetch playlists based on an array of playlist IDs.
 *     description: This route retrieves multiple playlists by their IDs, provided in the request body. It returns the playlist data in a formatted array, including relevant playlist details.
 *     tags: [Playlists]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               playlistIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["60f9cfcf123abc124ef9d29", "60f9d0f123abdef1250aa29"]
 *     responses:
 *       200:
 *         description: A formatted array of playlist objects.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   coverImage:
 *                     type: string
 *                   date_created:
 *                     type: string
 *                   genre:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   hashtags:
 *                     type: array
 *                     items:
 *                       type: string
 *                   songs:
 *                     type: array
 *                     items:
 *                       type: string
 *       500:
 *         description: Error fetching playlists.
 */
userRoutes.post('/playlists', async (req, res) => {

    const {playlistIds} = req.body;
    if (playlistIds.length === 0) {
        res.status(200).json(playlistIds);
    } else {
        try {
            const playlists = await Playlist.find({
                _id: {$in: playlistIds}
            }).exec();
            const genres = await Genre.find().exec();
            if (playlists && playlists.length > 0) {
                const formattedPlaylists = await Promise.all(playlists.map(async (playlist) => {
                    const genre = genres.find(g => g._id.toString() === playlist.genre.toString());
                    const user = await User.findById(playlist.userId).exec();
                    return {
                        id: playlist._id.toString(),
                        userId: playlist.userId,
                        coverImage: playlist.coverImage,
                        date_created: playlist.date_created,
                        genre: genre ? genre.name : null,
                        name: playlist.name,
                        description: playlist.description,
                        hashtags: playlist.hashtags,
                        songs: playlist.songs,
                        user: user || null
                    };
                }));

                res.status(200).json(formattedPlaylists);
            }
        } catch (error) {
            res.status(500).json({message: 'Error fetching playlists', error: error.message});
        }
    }

});

/**
 * @swagger
 * /api/signup:
 *   post:
 *     summary: Creates a new user after signup
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the new user.
 *                 example: newuser
 *               email:
 *                 type: string
 *                 description: The email address of the new user.
 *                 example: newuser@example.com
 *               password:
 *                 type: string
 *                 description: The password for the new user account.
 *                 example: hashedPassword
 *               profile_picture:
 *                 type: string
 *                 description: Optional profile picture URL for the new user.
 *                 example: profilePic.jpg
 *               followers:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of follower IDs for the new user (initially empty).
 *                 example: []
 *               following:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of IDs of users the new user is following (initially empty).
 *                 example: []
 *               playlists_created:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of playlist IDs created by the user (initially empty).
 *                 example: []
 *               playlists_saved:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of playlist IDs saved by the user (initially empty).
 *                 example: []
 *               description:
 *                 type: string
 *                 description: Optional description or bio for the new user.
 *                 example: New user bio.
 *     responses:
 *       201:
 *         description: Successfully created user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 profile_picture:
 *                   type: string
 *                 followers:
 *                   type: array
 *                   items:
 *                     type: string
 *                 following:
 *                   type: array
 *                   items:
 *                     type: string
 *                 playlists_created:
 *                   type: array
 *                   items:
 *                     type: string
 *                 playlists_saved:
 *                   type: array
 *                   items:
 *                     type: string
 *                 description:
 *                   type: string
 *       400:
 *         description: Validation or creation errors.
 */
userRoutes.post('/signup', async (req, res) => {
    try {
        const {
            username,
            email,
            password,
            profile_picture,
            followers,
            following,
            playlists_created,
            playlists_saved,
            description
        } = req.body;

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
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

/**
 * @swagger
 * /api/genres:
 *   post:
 *     summary: Creates a new genre.
 *     description: This route allows users to create a new genre by providing the necessary details. The newly created genre is saved in the database and returned in the response.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Rock"
 *     responses:
 *       201:
 *         description: The newly created genre object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "64e3f1bc9f12a61d2c5a4c56"
 *                 name:
 *                   type: string
 *                   example: "Rock"
 *       400:
 *         description: Genre name is required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Genre name is required"
 *       500:
 *         description: Failed to create genre.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to create genre"
 */
userRoutes.post('/genres', async (req, res) => {
    const {name} = req.body;

    if (!name) {
        return res.status(400).json({error: 'Genre name is required'});
    }

    try {
        const newGenre = new Genre({name});
        await newGenre.save();
        res.status(201).json(newGenre);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

/**
 * @swagger
 * /api/add/playlist/{userId}:
 *   post:
 *     summary: Creates a new playlist for a user.
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user creating the playlist.
 *         schema:
 *           type: string
 *       - name: playlist
 *         in: body
 *         required: true
 *         description: The details for the new playlist.
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             date_created:
 *               type: string
 *             genre:
 *               type: string
 *             description:
 *               type: string
 *             hashtags:
 *               type: array
 *               items:
 *                 type: string
 *             songs:
 *               type: array
 *               items:
 *                 type: string
 *             coverImage:
 *               type: string
 *     responses:
 *       201:
 *         description: The newly created playlist object and the updated user object.
 *         schema:
 *           type: object
 *           properties:
 *             playlist:
 *               $ref: '#/definitions/Playlist'
 *             user:
 *               $ref: '#/definitions/User'
 *       400:
 *         description: Validation or creation errors
 *       404:
 *         description: User not found
 */
userRoutes.post('/add/playlist/:userId', async (req, res) => {
    try {
        const {userId, coverImage, date_created, genre, name, description, hashtags, songs} = req.body;
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
            return res.status(404).json({message: 'User not found'});
        }

        user.playlists_created.push(newPlaylist._id);
        await user.save();

        res.status(201).json({playlist: newPlaylist, user: user});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

/**
 * @swagger
 * /api/add/song:
 *   post:
 *     summary: Adds a new song to the database.
 *     parameters:
 *       - name: song
 *         in: body
 *         required: true
 *         description: The details for the new song.
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *             artist:
 *               type: string
 *             link:
 *               type: string
 *             genre:
 *               type: string
 *     responses:
 *       201:
 *         description: The newly created song object.
 *         schema:
 *           $ref: '#/definitions/Song'
 *       400:
 *         description: Validation or creation errors
 */
userRoutes.post('/add/song', async (req, res) => {
    try {
        const {title, artist, link, genre} = req.body;
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
        res.status(400).json({message: error.message});
    }
});

/**
 * @swagger
 * /api/playlists/by-users:
 *   post:
 *     summary: Fetches playlists based on an array of user IDs.
 *     parameters:
 *       - name: userIds
 *         in: body
 *         required: true
 *         description: The array of user IDs to retrieve playlists for.
 *         schema:
 *           type: object
 *           properties:
 *             userIds:
 *               type: array
 *               items:
 *                 type: string
 *     responses:
 *       200:
 *         description: A formatted array of playlist objects.
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Playlist'
 *       400:
 *         description: User IDs are required
 *       404:
 *         description: No playlists found for the provided user IDs
 */
userRoutes.post('/playlists/by-users', async (req, res) => {
    const {userIds} = req.body;

    if (!userIds || userIds.length === 0) {
        return res.status(400).json({message: 'User IDs are required'});
    }

    try {
        const playlists = await Playlist.find({
            userId: {$in: userIds}
        }).exec();

        const genres = await Genre.find().exec();

        if (playlists.length === 0) {
            return res.status(404).json({message: 'No playlists found for the provided user IDs'});
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
        res.status(500).json({message: 'Error fetching playlists', error: error.message});
    }
});

/**
 * @swagger
 * /api/comments/{playlistId}:
 *   post:
 *     summary: Add a comment to a specific playlist.
 *     description: This route allows users to add a comment to a playlist by providing the playlist ID, comment content, and the user ID. The new comment is saved in the database and returned in the response.
 *     parameters:
 *       - name: playlistId
 *         in: path
 *         required: true
 *         description: The ID of the playlist to which the comment is added.
 *         schema:
 *           type: string
 *       - name: body
 *         in: body
 *         required: true
 *         description: The comment data.
 *         schema:
 *           type: object
 *           properties:
 *             content:
 *               type: string
 *               example: "Great playlist!"
 *             userId:
 *               type: string
 *               example: "60f9d0f123abdef1250aa29"
 *     responses:
 *       201:
 *         description: The newly created comment object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 content:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 playlistId:
 *                   type: string
 *       400:
 *         description: Content and userId are required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Content and userId are required."
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */
userRoutes.post('/comments/:playlistId', async (req, res) => {
    const {playlistId} = req.params;
    const {content, userId} = req.body;

    if (!content || !userId) {
        return res.status(400).json({message: 'Content and userId are required.'});
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
        res.status(500).json({message: 'Server error'});
    }
});

/**
 * @swagger
 * /api/songsInPlaylist:
 *   post:
 *     summary: Fetch songs based on an array of song IDs.
 *     description: This route retrieves songs from the database that match the provided song IDs in the request body. It responds with a formatted array of song objects containing details like title, artist, and Spotify link.
 *     tags: [Songs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               songIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["60e9fbcf9b1e8d24d4f7d4b9", "60e9fbcf9b1e8d24d4f7d4c0"]
 *     responses:
 *       200:
 *         description: An array of formatted song objects.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   artist:
 *                     type: string
 *                   link:
 *                     type: string
 *                   genre:
 *                     type: string
 *       500:
 *         description: Error fetching songs.
 */
userRoutes.post('/songsInPlaylist', async (req, res) => {
    const {songIds} = req.body;
    if (songIds.length === 0) {
        res.status(200).json(songIds);
    } else {
        try {
            const songs = await Song.find({
                _id: {$in: songIds}
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
            res.status(500).json({message: 'Error fetching songs', error: error.message});
        }
    }

});

/**
 * @swagger
 * /api/addSong/{playlistId}:
 *   put:
 *     summary: Update the songs array of a playlist.
 *     description: This route updates the song list of a specific playlist by its ID. It replaces the existing song array with the new array of songs provided in the request body.
 *     tags: [Playlists]
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         description: The ID of the playlist to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               songs:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["60e9fbcf9b1e8d24d4f7d4b9", "60e9fbcf9b1e8d24d4f7d4c0"]
 *     responses:
 *       200:
 *         description: The updated playlist object with its new songs array.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 songs:
 *                   type: array
 *                   items:
 *                     type: string
 *                 userId:
 *                   type: string
 *                 date_created:
 *                   type: string
 *       400:
 *         description: Invalid playlist ID format or songs must be an array.
 *       404:
 *         description: Playlist not found.
 *       500:
 *         description: Failed to update playlist songs.
 */
userRoutes.put('/addSong/:playlistId', async (req, res) => {
    const {playlistId} = req.params;
    const {songs} = req.body;

    console.log(`Received request to update playlist with ID: ${playlistId}`);

    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        console.error('Invalid playlist ID format:', playlistId);
        return res.status(400).json({message: 'Invalid playlist ID format.'});
    }

    if (!Array.isArray(songs)) {
        console.error('Songs must be an array:', songs);
        return res.status(400).json({message: 'Songs must be an array.'});
    }

    try {
        const updatedPlaylist = await Playlist.findByIdAndUpdate(
            playlistId,
            {songs},
            {new: true, runValidators: true}
        );

        if (!updatedPlaylist) {
            return res.status(404).json({message: 'Playlist not found.'});
        }

        res.json(updatedPlaylist);
    } catch (error) {
        console.error('Error updating playlist songs:', error);
        res.status(500).json({message: 'Failed to update playlist songs.'});
    }
});

/**
 * @swagger
 * /api/update/playlist/{id}:
 *   put:
 *     summary: Updates the details of a playlist by its ID.
 *     description: This route updates the details of a specific playlist, including optional parameters for name, description, and genre.
 *     tags: [Playlists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the playlist to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "New Playlist Name"
 *               description:
 *                 type: string
 *                 example: "New description for the playlist."
 *               genre:
 *                 type: string
 *                 example: "Pop"
 *     responses:
 *       200:
 *         description: The updated playlist object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 genre:
 *                   type: string
 *       400:
 *         description: Invalid playlist ID format.
 *       404:
 *         description: Playlist not found.
 *       500:
 *         description: Failed to update playlist details.
 */
userRoutes.put('/update/playlist/:id', async (req, res) => {
    const {id} = req.params;
    const {name, description, genre, hashtags, coverImage} = req.body;


    try {
        const updatePlaylist = await Playlist.findByIdAndUpdate(id, {
            name,
            description,
            genre,
            hashtags,
            coverImage
        }, {new: true});

        if (!updatePlaylist) {
            return res.status(404).json({message: "Playlist not found"});
        }

        res.json(updatePlaylist);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server error"});
    }
});

/**
 * @swagger
 * /api/user/{userId}/save-playlist:
 *   put:
 *     summary: Updates the saved playlists of a user by adding or removing a playlist ID.
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user whose playlists are being updated.
 *         schema:
 *           type: string
 *       - name: playlistId
 *         in: body
 *         required: true
 *         description: The ID of the playlist to add or remove from the user's saved playlists.
 *         schema:
 *           type: object
 *           properties:
 *             playlistId:
 *               type: string
 *     responses:
 *       200:
 *         description: The updated user object with the modified playlists_saved array.
 *         schema:
 *           type: object
 *           properties:
 *             user:
 *               $ref: '#/definitions/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
userRoutes.put('/user/:userId/save-playlist', async (req, res) => {
    const {userId} = req.params;
    const {playlistId} = req.body;

    try {
        const user = await User.findById(userId).exec();

        if (!user) {
            return res.status(404).json({message: 'User not found'});
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
        res.status(500).json({message: 'Server error'});
    }
});

/**
 * @swagger
 * /api/user/{id}:
 *   put:
 *     summary: Updates the details of a user by their ID
 *     tags: [User]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The new username of the user.
 *               description:
 *                 type: string
 *                 description: The new description of the user.
 *               profile_picture:
 *                 type: string
 *                 description: The new profile picture URL of the user.
 *     responses:
 *       200:
 *         description: The updated user object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique identifier for the user.
 *                 username:
 *                   type: string
 *                   description: The username of the user.
 *                 email:
 *                   type: string
 *                   description: The email address of the user.
 *                 profile_picture:
 *                   type: string
 *                   description: The URL of the user's profile picture.
 *                 followers:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of follower IDs.
 *                 following:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of IDs of users this user is following.
 *                 playlists_created:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of playlist IDs created by the user.
 *                 playlists_saved:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of playlist IDs saved by the user.
 *                 description:
 *                   type: string
 *                   description: Optional description or bio for the user.
 *           examples:
 *             application/json:
 *               value: {
 *                 "id": "64e3f1bc9f12a61d2c5a4c58",
 *                 "username": "newUsername",
 *                 "email": "user@example.com",
 *                 "profile_picture": "newProfilePic.jpg",
 *                 "followers": ["64e3f1bc9f12a61d2c5a4c57"],
 *                 "following": ["64e3f1bc9f12a61d2c5a4c59"],
 *                 "playlists_created": ["64e3f1bc9f12a61d2c5a4c5a"],
 *                 "playlists_saved": ["64e3f1bc9f12a61d2c5a4c5b"],
 *                 "description": "Updated user description"
 *               }
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *             examples:
 *               application/json:
 *                 value: {
 *                   "message": "User not found"
 *                 }
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 */
userRoutes.put('/user/:id', async (req, res) => {
    const {id} = req.params;
    const {username, description, profile_picture} = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(id, {
            username,
            description,
            profile_picture,
        }, {new: true});

        if (!updatedUser) {
            return res.status(404).json({message: "User not found"});
        }

        res.json(updatedUser);
    } catch (error) {

        res.status(500).json({message: "Server error"});
    }
});

/**
 * @swagger
 * /api/user/{id}:
 *   put:
 *     summary: Updates the details of a user by their ID
 *     tags: [User]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The new username of the user.
 *               description:
 *                 type: string
 *                 description: The new description of the user.
 *               profile_picture:
 *                 type: string
 *                 description: The new profile picture URL of the user.
 *           example:
 *             username: "newUsername"
 *             description: "Updated user description"
 *             profile_picture: "newProfilePic.jpg"
 *     responses:
 *       200:
 *         description: The updated user object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique identifier for the user.
 *                 username:
 *                   type: string
 *                   description: The username of the user.
 *                 email:
 *                   type: string
 *                   description: The email address of the user.
 *                 profile_picture:
 *                   type: string
 *                   description: The URL of the user's profile picture.
 *                 followers:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of follower IDs.
 *                 following:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of IDs of users this user is following.
 *                 playlists_created:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of playlist IDs created by the user.
 *                 playlists_saved:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of playlist IDs saved by the user.
 *                 description:
 *                   type: string
 *                   description: Optional description or bio for the user.
 *           examples:
 *             application/json:
 *               value: {
 *                 "id": "64e3f1bc9f12a61d2c5a4c58",
 *                 "username": "newUsername",
 *                 "email": "user@example.com",
 *                 "profile_picture": "newProfilePic.jpg",
 *                 "followers": ["64e3f1bc9f12a61d2c5a4c57"],
 *                 "following": ["64e3f1bc9f12a61d2c5a4c59"],
 *                 "playlists_created": ["64e3f1bc9f12a61d2c5a4c5a"],
 *                 "playlists_saved": ["64e3f1bc9f12a61d2c5a4c5b"],
 *                 "description": "Updated user description"
 *               }
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *             examples:
 *               application/json:
 *                 value: {
 *                   "message": "User not found"
 *                 }
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *             examples:
 *               application/json:
 *                 value: {
 *                   "message": "Server error"
 *                 }
 */
userRoutes.put('/user/admin/:id', async (req, res) => {
    const {id} = req.params;
    const {username, email, description, profile_picture} = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(id, {
            username,
            email,
            description,
            profile_picture,
        }, {new: true});

        if (!updatedUser) {
            return res.status(404).json({message: "User not found"});
        }

        res.json(updatedUser);
    } catch (error) {

        res.status(500).json({message: "Server error"});
    }
});

/**
 * @swagger
 * /api/song/admin/{id}:
 *   put:
 *     summary: Updates the details of a Song by its ID
 *     tags: [Song]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the song to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The new title of the song.
 *               artist:
 *                 type: string
 *                 description: The new artist of the song.
 *               link:
 *                 type: string
 *                 description: The new song link.
 *               genre:
 *                 type: string
 *                 description: The new genre ID of the song.
 *           example:
 *             title: "New Song Title"
 *             artist: "New Artist Name"
 *             link: "https://open.spotify.com/track/newSongId"
 *             genre: "66e377a9b13b146f637c9b..."
 *     responses:
 *       200:
 *         description: The updated song object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique identifier for the song.
 *                 title:
 *                   type: string
 *                   description: The title of the song.
 *                 artist:
 *                   type: string
 *                   description: The artist of the song.
 *                 link:
 *                   type: string
 *                   description: The link to the song.
 *                 genre:
 *                   type: string
 *                   description: The genre ID of the song.
 *                 playlists:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of playlist IDs the song is included in.
 *                 duration:
 *                   type: string
 *                   description: The duration of the song.
 *           examples:
 *             application/json:
 *               value: {
 *                 "id": "64e3f1bc9f12a61d2c5a4c58",
 *                 "title": "New Song Title",
 *                 "artist": "New Artist Name",
 *                 "link": "https://open.spotify.com/track/newSongId",
 *                 "genre": "66e377a9b13b146f637c9b...",
 *                 "playlists": ["64e3f1bc9f12a61d2c5a4c5a"],
 *                 "duration": "3:45"
 *               }
 *       404:
 *         description: Song not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *             examples:
 *               application/json:
 *                 value: {
 *                   "message": "Song not found"
 *                 }
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *             examples:
 *               application/json:
 *                 value: {
 *                   "message": "Server error"
 *                 }
 */
userRoutes.put('/song/admin/:id', async (req, res) => {
    const {id} = req.params;
    const {title, artist, link, genre} = req.body;

    try {
        const updatedSong = await Song.findByIdAndUpdate(id, {
            title,
            artist,
            link,
            genre,
        }, {new: true});

        if (!updatedSong) {
            return res.status(404).json({message: "Song not found"});
        }

        res.json(updatedSong);
    } catch (error) {

        res.status(500).json({message: "Server error"});
    }
});

/**
 * @swagger
 * /api/users/{id}/follow:
 *   patch:
 *     summary: Updates the following/follower arrays for two users.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the current user who is following another user.
 *         schema:
 *           type: string
 *           example: "60f9cfcf123abc124ef9d28"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               followedUserId:
 *                 type: string
 *                 example: "60f9cfcf123abc124ef9d29"
 *     responses:
 *       200:
 *         description: Following updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Following updated successfully"
 *                 user1:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60f9cfcf123abc124ef9d28"
 *                     username:
 *                       type: string
 *                       example: "user1"
 *                     following:
 *                       type: array
 *                       items:
 *                         type: string
 *                     followers:
 *                       type: array
 *                       items:
 *                         type: string
 *                 user2:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60f9cfcf123abc124ef9d29"
 *                     username:
 *                       type: string
 *                       example: "user2"
 *                     following:
 *                       type: array
 *                       items:
 *                         type: string
 *                     followers:
 *                       type: array
 *                       items:
 *                         type: string
 *       404:
 *         description: One or both users not found.
 *       500:
 *         description: Error updating following.
 */
userRoutes.patch('/users/:id/follow', async (req, res) => {
    try {
        const userId = req.params.id;
        const {followedUserId} = req.body;

        // Find the current user (user1)
        const user1 = await User.findById(userId).exec();
        // Find the followed user (user2)
        const user2 = await User.findById(followedUserId).exec();

        if (!user1 || !user2) {
            return res.status(404).json({message: 'One or both users not found'});
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
            user1: user1,
            user2: user2
        });
    } catch (error) {
        console.error('Error updating following:', error.message);
        res.status(500).json({message: 'Error updating following', error: error.message});
    }
});

/**
 * @swagger
 * /api/users/{userId}:
 *   delete:
 *     summary: Deletes a user by ID from the database.
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully"
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Failed to delete user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to delete user"
 */
userRoutes.delete('/users/:userId', async (req, res) => {
    const {userId} = req.params;
    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        res.status(200).json({message: 'User deleted successfully'});
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({error: 'Failed to delete user'});
    }
});

/**
 * @swagger
 * /api/songs/{songId}:
 *   delete:
 *     summary: Deletes a song by ID from the database.
 *     parameters:
 *       - name: songId
 *         in: path
 *         required: true
 *         description: The ID of the song to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Song deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Song deleted successfully"
 *       404:
 *         description: Song not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Song not found"
 *       500:
 *         description: Failed to delete song.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to delete song"
 */
userRoutes.delete('/songs/:songId', async (req, res) => {
    const {songId} = req.params;
    try {
        const song = await Song.findByIdAndDelete(songId);
        if (!song) {
            return res.status(404).json({message: 'Song not found'});
        }
        res.status(200).json({message: 'Song deleted successfully'});
    } catch (error) {
        console.error("Error deleting song:", error);
        res.status(500).json({error: 'Failed to delete song'});
    }
});

/**
 * @swagger
 * /api/playlists/{playlistId}:
 *   delete:
 *     summary: Deletes a playlist by its ID.
 *     description: This route deletes the playlist and removes it from the user's created playlists. Additionally, it removes the playlist from any user's saved playlists.
 *     parameters:
 *       - name: playlistId
 *         in: path
 *         required: true
 *         description: The ID of the playlist to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success message if the playlist was deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Playlist deleted successfully"
 *       404:
 *         description: Playlist not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Playlist not found"
 *       500:
 *         description: Error deleting playlist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error deleting playlist"
 */
userRoutes.delete('/playlists/:playlistId', async (req, res) => {
    const {playlistId} = req.params;
    try {
        const playlist = await Playlist.findByIdAndDelete(playlistId);

        if (!playlist) {
            return res.status(404).json({message: 'Playlist not found'});
        }

        await User.updateMany(
            {$or: [{playlists_created: playlistId}, {playlists_saved: playlistId}]},
            {$pull: {playlists_created: playlistId, playlists_saved: playlistId}}
        );

        res.status(200).json({message: 'Playlist deleted successfully'});
    } catch (error) {
        console.error("Error deleting playlist:", error);
        res.status(500).json({error: 'Failed to delete playlist or update users'});
    }
});

/**
 * @swagger
 * /api/users/admin/{userId}:
 *   delete:
 *     summary: Marks a user as deleted.
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user to be marked as deleted.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User marked as deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User marked as deleted successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "64e3f1bc9f12a61d2c5a4c56"
 *                     username:
 *                       type: string
 *                       example: "deletedUser"
 *                     profile_picture:
 *                       type: string
 *                       example: "https://i.pinimg.com/736x/83/bc/8b/83bc8b88cf6bc4b4e04d153a418cde62.jpg"
 *                     description:
 *                       type: string
 *                       example: ""
 *                     email:
 *                       type: string
 *                       example: "redacted@email.com"
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Failed to update user or remove from followers/following.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to update user or remove from followers/following"
 */
userRoutes.delete('/users/admin/:userId', async (req, res) => {
    const {userId} = req.params;
    try {
        // Update the user to mark as deleted
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                username: 'deletedUser',
                profile_picture: 'https://i.pinimg.com/736x/83/bc/8b/83bc8b88cf6bc4b4e04d153a418cde62.jpg',
                description: '',
                email: 'redacted@email.com',
                following: [],
                followers: []
            },
            {new: true}
        );

        if (!updatedUser) {
            return res.status(404).json({message: 'User not found'});
        }

        await User.updateMany(
            {$or: [{followers: userId}, {following: userId}]},
            {$pull: {followers: userId, following: userId}}
        );

        res.status(200).json({message: 'User marked as deleted successfully', user: updatedUser});
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({error: 'Failed to update user or remove from followers/following'});
    }
});

/**
 * @swagger
 * /api/songs/admin/{songId}:
 *   delete:
 *     summary: Marks a song as redacted.
 *     parameters:
 *       - name: songId
 *         in: path
 *         required: true
 *         description: The ID of the song to be updated.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Song marked as redacted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Song marked as redacted successfully"
 *                 song:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "64e3f1bc9f12a61d2c5a4c56"
 *                     name:
 *                       type: string
 *                       example: "Song Name"
 *                     url:
 *                       type: string
 *                       example: "https://example.com/song"
 *                     artist:
 *                       type: string
 *                       example: "Artist Name"
 *                     genre:
 *                       type: string
 *                       example: "Pop"
 *                     description:
 *                       type: string
 *                       example: ""
 *       404:
 *         description: Song not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Song not found"
 *       500:
 *         description: Failed to update song.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to update song"
 */
userRoutes.delete('/songs/admin/:songId', async (req, res) => {
    const {songId} = req.params;
    try {
        const updatedSong = await Song.findByIdAndUpdate(
            songId,
            {link: 'redacted'},
            {new: true}
        );

        if (!updatedSong) {
            return res.status(404).json({message: 'Song not found'});
        }

        res.status(200).json({message: 'Song marked as redacted successfully', song: updatedSong});
    } catch (error) {
        console.error("Error updating song:", error);
        res.status(500).json({error: 'Failed to update song'});
    }
});

/**
 * @swagger
 * /api/playlists/{playlistId}:
 *   delete:
 *     summary: Deletes a playlist by its ID.
 *     description: This route deletes the playlist and removes it from the user's created playlists. Additionally, it removes the playlist from any user's saved playlists.
 *     parameters:
 *       - name: playlistId
 *         in: path
 *         required: true
 *         description: The ID of the playlist to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success message if the playlist was deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Playlist deleted successfully"
 *       404:
 *         description: Playlist not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Playlist not found"
 *       500:
 *         description: Error deleting playlist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error deleting playlist"
 */
userRoutes.delete('/playlists/:playlistId', async (req, res) => {
    const {playlistId} = req.params;

    try {
        const playlist = await Playlist.findById(playlistId);

        if (!playlist) {
            return res.status(404).json({message: 'Playlist not found'});
        }

        const {userId} = playlist;
        await Playlist.findByIdAndDelete(playlistId);
        await User.findByIdAndUpdate(userId, {
            $pull: {playlists_created: playlistId}
        });
        await User.updateMany(
            {playlists_saved: playlistId},
            {$pull: {playlists_saved: playlistId}}
        );

        res.status(200).json({message: 'Playlist deleted successfully'});
    } catch (error) {
        console.error('Error deleting playlist:', error);
        res.status(500).json({message: 'Error deleting playlist', error: error.message});
    }
});

/**
 * @swagger
 * /api/user/{userId}/follower/{followerId}:
 *   delete:
 *     summary: Removes a follower from a user's following array.
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user.
 *         schema:
 *           type: string
 *       - name: followerId
 *         in: path
 *         required: true
 *         description: The ID of the follower to be removed.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The updated user object.
 *         schema:
 *           $ref: '#/definitions/User'
 *       404:
 *         description: User or follower not found
 */
userRoutes.delete('/user/:userId/follower/:followerId', async (req, res) => {
    try {
        const {userId, followerId} = req.params;

        const user = await User.findByIdAndUpdate(
            userId,
            {$pull: {following: followerId}},
            {new: true}
        ).exec();

        const follower = await User.findByIdAndUpdate(
            followerId,
            {$pull: {followers: userId}},
            {new: true}
        ).exec();

        if (!user || !follower) {
            return res.status(404).json({message: 'User or follower not found'});
        }

        if (user && follower) {
            return res.status(200).json(user);
        }
    } catch (error) {
        console.error(`Error removing follower from user's following list:`, error);
        res.status(500).json({message: 'Failed to remove follower from user follower list'});
    }
});

/**
 * @swagger
 * /api/playlist/{playlistId}/song/{songId}:
 *   delete:
 *     summary: Removes a song from a playlist's songs array.
 *     parameters:
 *       - name: playlistId
 *         in: path
 *         required: true
 *         description: The ID of the playlist.
 *         schema:
 *           type: string
 *       - name: songId
 *         in: path
 *         required: true
 *         description: The ID of the song to be removed.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The updated playlist object.
 *         schema:
 *           $ref: '#/definitions/Playlist'
 *       404:
 *         description: Playlist or song not found
 */
userRoutes.delete('/playlist/:playlistId/song/:songId', async (req, res) => {
    try {
        const {playlistId, songId} = req.params;

        const playlist = await Playlist.findByIdAndUpdate(
            playlistId,
            {$pull: {songs: songId}},
            {new: true}
        ).exec();

        if (!playlist) {
            return res.status(404).json({message: 'Playlist not found'});
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

            const comments = await Comment.find({playlistId}).exec();

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
        res.status(500).json({message: 'Failed to remove song from playlist'});
    }
});


module.exports = userRoutes;
