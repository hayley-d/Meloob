/**
 * Creates a new user after signup.
 *
 *  POST /api/signup
 *  Operations about users
 *
 * @returns {Object} 201 - The newly created user object.
 * @returns {Error} 400 - Validation or creation errors.
 *
 * @example {json} Success-Response:
 *  HTTP/1.1 201 Created
 *  {
 *    "id": "64e3f1bc9f12a61d2c5a4c58",
 *    "username": "newuser",
 *    "email": "newuser@example.com",
 *    "password": "hashedPassword",
 *    "profile_picture": "profilePic.jpg",
 *    "followers": [],
 *    "following": [],
 *    "playlists_created": [],
 *    "playlists_saved": [],
 *    "description": "New user bio."
 *  }
 *
 * @example {json} Error-Response:
 *  HTTP/1.1 400 Bad Request
 *  {
 *    "message": "Error creating user"
 *  }
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
