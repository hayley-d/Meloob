import {mongoose} from "mongoose";


class DataManager {

    async getPlaylists() {
        return await fetch('http://localhost:3001/api/playlists')
            .then(response => response.json())
            .then(async data => {
                const updatedPlaylists = await Promise.all(
                    data.map(async playlist => {
                        playlist.user = await dataManager.getUser(playlist.userId);
                        return playlist;
                    })
                );
                return updatedPlaylists;
            })
            .catch(error => {
                console.error('Error fetching playlists:', error);
            });
    }


    async getSongs() {
        return await fetch('http://localhost:3001/api/songs')
            .then(response => response.json())
            .then(data => {
                return data;
            })
            .catch(error => {
                console.error('Error fetching songs:', error);
            });
    }

    async getUsers() {
        return await fetch('http://localhost:3001/api/users')
            .then(response => response.json())
            .then(data => {
                return data;
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    }

    async getGenres() {
        return await fetch('http://localhost:3001/api/genres')
            .then(response => response.json())
            .then(data => {
                return data;
            })
            .catch(error => {
                console.error('Error fetching genres:', error);
            });
    }

    //retrieves a single playlist given an id
    async getPlaylistByID(playlistId) {
        return await fetch(`http://localhost:3001/api/playlists/${playlistId}`).then(response => response.json())
            .then(async data => {
                return data;
            })
            .catch(error => {
                console.error('Error fetching playlist:', error);
            });
    }

//retrieves a user by id
    async getUser(id) {
        return await fetch(`/api/users/${id}`)
            .then(response => response.json())
            .then(data => {
                return data;
            })
            .catch(error => {
                console.error('Error fetching user:', error);
            });
    }

    async getFollowing(following_array) {
        let following = [];
        try {
            following = await Promise.all(
                following_array.map(async (id) => {
                    return await fetch(`/api/users/${id}`)
                        .then(response => response.json())
                        .catch(error => {
                            console.error(`Failed to fetch data for user ${id}:`, error);
                            return {};
                        });
                })
            );
        } catch (error) {
            console.error('Error fetching following data:', error);
        }
        return following;
    }


    //retrieves a user by email
    async getUserByEmail(email) {
        return await fetch(`http://localhost:3001/api/user/email/${encodeURIComponent(email)}`)
            .then(response => response.json())
            .then(data => {
                return data;
            })
            .catch(error => {
                console.error('Error fetching songs:', error);
            });
    }

    //used to update the following/followers of two users
    async updateUserFollowing(userId, followedUserId) {
        try {
            const response = await fetch(`http://localhost:3001/api/users/${userId}/follow`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({followedUserId})
            });

            if (response.ok) {
                const data = await response.json();
                const user = data.user2;
                sessionStorage.setItem('userData', JSON.stringify(data.user1));
                return user;
            } else {
                const errorData = await response.json();
                console.error('Error updating following:', errorData.message);
                throw new Error(errorData.message);
            }
        } catch (error) {
            console.error('Error in updateUserFollowing:', error);
            throw error;
        }
    }

    //given an array of playlist ids retrieves all playlists with those ids
    async getPlaylistsByIds(playlistIds) {
        try {
            const response = await fetch('http://localhost:3001/api/playlists', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({playlistIds}),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch playlists');
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching playlists:", error);
            throw error;
        }
    }

    /**
     * Updates the profile details of a user.
     *
     * @param {string} id - The ID of the user to update.
     * @param {Object} updatedDetails - The details to update the user with.
     * @param {string} [updatedDetails.username] - The new username of the user.
     * @param {string} [updatedDetails.description] - The new description of the user.
     * @param {string} [updatedDetails.profile_picture] - The URL of the new profile picture.
     * @returns {Promise<void>} - A promise that resolves when the user profile is updated.
     * @throws {Error} - Throws an error if the request fails or if the response is not OK.
     *
     * @example
     * // Example usage:
     * const userId = '64e3f1bc9f12a61d2c5a4c58';
     * const updatedDetails = {
     *   username: 'NewUsername',
     *   description: 'Updated description',
     *   profile_picture: 'http://example.com/newprofilepic.jpg'
     * };
     * updateUserProfile(userId, updatedDetails)
     *   .then(() => console.log('User profile updated successfully'))
     *   .catch(error => console.error('Error:', error));
     *
     * @example
     * // Example response:
     * {
     *   "id": "64e3f1bc9f12a61d2c5a4c58",
     *   "username": "NewUsername",
     *   "email": "user@example.com",
     *   "profile_picture": "http://example.com/newprofilepic.jpg",
     *   "followers": ["64e3f1bc9f12a61d2c5a4c60"],
     *   "following": ["64e3f1bc9f12a61d2c5a4c61"],
     *   "playlists_created": ["64e3f1bc9f12a61d2c5a4c62"],
     *   "playlists_saved": ["64e3f1bc9f12a61d2c5a4c63"],
     *   "description": "Updated description"
     * }
     */
    async updateUserProfile(id, updatedDetails) {
        try {
            const response = await fetch(`http://localhost:3001/api/user/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedDetails),
            });

            if (!response.ok) {
                throw new Error('Failed to update user');
            }

            const updatedUser = await response.json();
            return updatedUser;
        } catch (error) {
            console.error("Error updating profile:", error);
            throw error;
        }
    }

    /**
     * Updates the details of a playlist by its ID.
     *
     * @async
     * @param {string} id - The ID of the playlist to update.
     * @param {Object} updatedDetails - The new details for the playlist.
     * @param {string} [updatedDetails.name] - The new name of the playlist.
     * @param {string} [updatedDetails.description] - The new description of the playlist.
     * @param {string} [updatedDetails.genre] - The genre of the playlist.
     * @param {string[]} [updatedDetails.hashtags] - An array of new hashtags for the playlist.
     * @param {string} [updatedDetails.coverImage] - The new cover image URL of the playlist.
     * @returns {Promise<Object>} The updated playlist object.
     * @throws {Error} Throws an error if the request fails.
     *
     * @example
     * const updatedDetails = {
     *   name: 'New Playlist Name',
     *   description: 'Updated playlist description',
     *   genre: 'New Genre',
     *   hashtags: ['tag1', 'tag2'],
     *   coverImage: 'https://example.com/new-cover-image.jpg'
     * };
     *
     * try {
     *   const updatedPlaylist = await dataManager.updatePlaylist('playlistId123', updatedDetails);
     *   console.log(updatedPlaylist);
     * } catch (error) {
     *   console.error("Error updating playlist:", error);
     * }
     */
    async updatePlaylist(id, updatedDetails) {
        try {
            const response = await fetch(`http://localhost:3001/api/update/playlist/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedDetails),
            });

            if (!response.ok) {
                throw new Error('Failed to update user');
            }

            const playlist = await response.json();
            return playlist;
        } catch (error) {
            console.error("Error updating profile:", error);
            throw error;
        }
    }

    /**
     * Updates the songs array of a specific playlist.
     *
     * @param {string} playlistId - The ID of the playlist to update.
     * @param {Array<Object>} songs - The new array of songs to be added to the playlist.
     * @param {string} songs[].id - The ID of the song.
     * @param {string} songs[].title - The title of the song.
     * @param {string} songs[].artist - The artist of the song.
     * @param {string} songs[].link - The link to the song.
     * @param {string} songs[].genre - The genre of the song.
     * @returns {Promise<Object>} - A promise that resolves to the updated playlist object.
     * @throws {Error} - Throws an error if the request fails or if the response is not OK.
     *
     * @example
     * // Example usage:
     * const playlistId = '64e3f1bc9f12a61d2c5a4c58';
     * const newSongs = [
     *   { id: '64e3f1bc9f12a61d2c5a4c59', title: 'New Song', artist: 'Artist', link: 'http://spotify.com/newsong', genre: 'Pop' }
     * ];
     * updatePlaylistSongs(playlistId, newSongs)
     *   .then(updatedPlaylist => console.log('Updated Playlist:', updatedPlaylist))
     *   .catch(error => console.error('Error:', error));
     *
     * @example
     * // Example response:
     * {
     *   "id": "64e3f1bc9f12a61d2c5a4c58",
     *   "userId": "64e3f1bc9f12a61d2c5a4c60",
     *   "coverImage": "http://image.com/cover.jpg",
     *   "date_created": "2024-01-01T00:00:00Z",
     *   "genre": "Pop",
     *   "name": "My Playlist",
     *   "description": "A great playlist",
     *   "hashtags": ["#pop", "#new"],
     *   "songs": [
     *     { "id": "64e3f1bc9f12a61d2c5a4c59", "title": "New Song", "artist": "Artist", "link": "http://spotify.com/newsong", "genre": "Pop" }
     *   ]
     * }
     */
    async updatePlaylistSongs(playlistId, songs) {
        try {
            const response = await fetch(`http://localhost:3001/api/addSong/${playlistId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({songs}),
            });

            if (!response.ok) {
                throw new Error('Failed to update playlist songs');
            }

            const updatedPlaylist = await response.json();
            return updatedPlaylist;
        } catch (error) {
            console.error('Error updating playlist songs:', error);
            throw error;
        }
    }

    /**
     * Retrieves all songs associated with the given array of song IDs.
     *
     * @param {Array<string>} songIds - An array of song IDs to retrieve the songs for.
     * @returns {Promise<Array<Object>>} - A promise that resolves to an array of song objects.
     * @throws {Error} - Throws an error if the request fails or if the response is not OK.
     *
     * @example
     * // Example usage:
     * const songIds = ['64e3f1bc9f12a61d2c5a4c58', '64e3f1bc9f12a61d2c5a4c59'];
     * getSongsByIds(songIds)
     *   .then(songs => console.log(songs))
     *   .catch(error => console.error('Error:', error));
     *
     * @example
     * // Example response:
     * [
     *   {
     *     "id": "64e3f1bc9f12a61d2c5a4c58",
     *     "title": "Song Title 1",
     *     "artist": "Artist 1",
     *     "link": "http://spotify.com/song1",
     *     "genre": "Pop"
     *   },
     *   {
     *     "id": "64e3f1bc9f12a61d2c5a4c59",
     *     "title": "Song Title 2",
     *     "artist": "Artist 2",
     *     "link": "http://spotify.com/song2",
     *     "genre": "Rock"
     *   }
     * ]
     */
    async getSongsByIds(songIds) {
        try {
            const response = await fetch('http://localhost:3001/api/songsInPlaylist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({songIds}),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch songs');
            }
            const result = await response.json();

            return result;
        } catch (error) {
            console.error("Error fetching songs:", error);
            throw error;
        }
    }

    async updateUserSavedPlaylist(userId, playlistId) {
        try {
            const response = await fetch(`http://localhost:3001/api/user/${userId}/save-playlist`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({playlistId}),
            });

            if (!response.ok) {
                throw new Error('Failed to update saved playlists');
            }

            const updatedUser = await response.json();
            sessionStorage.setItem('userData', JSON.stringify(updatedUser));
            return updatedUser.playlists_saved.includes(playlistId);
        } catch (error) {
            console.error("Error saving playlist:", error);
        }
    }

    /**
     * Adds a new playlist and updates the user's created playlists.
     *
     * @param {string} userId - The ID of the user who is creating the playlist.
     * @param {Object} playlistData - The data for the new playlist.
     * @param {string} playlistData.coverImage - The cover image URL for the playlist.
     * @param {string} playlistData.date_created - The creation date of the playlist.
     * @param {string} playlistData.genre - The genre of the playlist.
     * @param {string} playlistData.name - The name of the playlist.
     * @param {string} playlistData.description - The description of the playlist.
     * @param {Array} playlistData.hashtags - The hashtags for the playlist.
     * @param {Array} playlistData.songs - The songs in the playlist.
     *
     * @returns {Object} - The response object containing the newly created playlist and the updated user.
     * @throws {Error} - Throws an error if the request fails.
     */
    async addPlaylist(userId, playlistData) {
        try {
            const response = await fetch(`http://localhost:3001/api/add/playlist/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(playlistData),
            });

            if (!response.ok) {
                throw new Error('Failed to create playlist');
            }

            const result = await response.json();
            const updatedUser = result.user;
            sessionStorage.setItem('userData', JSON.stringify(updatedUser));
            return result;
        } catch (error) {
            console.error('Error adding playlist:', error);
            throw error;
        }
    }

    async addSong(songData) {
        try {
            const response = await fetch(`http://localhost:3001/api/add/song`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(songData),
            });

            if (!response.ok) {
                throw new Error('Failed to create song');
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error adding song:', error);
            throw error;
        }
    }

    async removeSongFromPlaylist(playlistId, songId) {
        try {
            const response = await fetch(`/api/playlist/${playlistId}/song/${songId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error removing song:', error);
        }
    }

    async removeFollower(userId, followerId) {
        try {
            const response = await fetch(`/api/user/${userId}/follower/${followerId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error removing followr:', error);
        }
    }

    /**
     * Fetches playlists for a given array of user IDs.
     *
     * @param {Array<string>} userIds - Array of user IDs for which playlists need to be fetched.
     * @returns {Promise<Array>} - A promise that resolves to an array of playlist objects.
     * @throws {Error} - Throws an error if the request fails.
     */
    async fetchPlaylistsByUserIds(userIds) {
        try {
            const response = await fetch('/api/playlists/by-users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({userIds})
            }).then(response => response.json())
                .then(async data => {
                    const updatedPlaylists = await Promise.all(
                        data.map(async playlist => {
                            playlist.user = await dataManager.getUser(playlist.userId);
                            return playlist;
                        })
                    );
                    return updatedPlaylists;
                });

            /* if (!response.ok) {
                 const errorData = await response.json();
                 throw new Error(errorData.message || 'Error fetching playlists');
             }*/

            //const data = await response.json();
            // console.log(response);
            return response;
        } catch (error) {
            console.error('Error fetching playlists by user IDs:', error);
            throw new Error(error.message);
        }
    }

    /**
     * Deletes a playlist by its ID.
     *
     * This function sends a DELETE request to remove the playlist from the database
     * and updates the users' created and saved playlists.
     *
     * @param {string} playlistId - The ID of the playlist to delete.
     * @returns {Promise<Object>} - A success or error message from the API response.
     * @throws {Error} - Throws an error if the API request fails.
     *
     * @example
     * dataManager.deletePlaylist('60f9d0f123abdef1250aa29')
     *   .then(response => console.log(response))
     *   .catch(error => console.error(error));
     */
    async deletePlaylist(playlistId) {
        try {
            const response = await fetch(`/api/playlists/${playlistId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error deleting playlist:', error);
            throw error;
        }
    }

    /**
     * Adds a comment to a specific playlist.
     *
     * @param {string} playlistId - The ID of the playlist to which the comment is added.
     * @param {Object} commentData - The data for the comment.
     * @param {string} commentData.content - The content of the comment.
     * @param {string} commentData.userId - The ID of the user adding the comment.
     * @returns {Promise<Object>} - The newly created comment object.
     * @throws {Error} - Throws an error if the request fails.
     */
    async addComment(playlistId, commentData) {
        try {
            const response = await fetch(`/api/comments/${playlistId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(commentData),
            });

            if (!response.ok) {
                throw new Error('Failed to add comment');
            }

            const data = await response.json();
            //console.log("New Comment:",data);
            return data;
        } catch (error) {
            console.error("Error adding comment:", error);
            throw new Error('Failed to add comment');
        }
    };

    /**
     * Deletes a user by ID.
     *
     * @param {string} userId - The ID of the user to delete.
     * @returns {Promise<Object>} - The response from the API.
     */
    async properlyDeleteUser(userId) {
        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete user');
            }
            return data;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }

    /**
     * Marks a user as Deletes by ID.
     *
     * @param {string} userId - The ID of the user to delete.
     * @returns {Promise<Object>} - The response from the API.
     */
    async deleteUser(userId) {
        try {
            const response = await fetch(`/api/users/admin/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete user');
            }
            return data;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }

    /**
     * Deletes a song by ID.
     *
     * @param {string} songId - The ID of the song to delete.
     * @returns {Promise<Object>} - The response from the API.
     */
    async deleteSong(songId) {
        try {
            const response = await fetch(`/api/songs/admin/${songId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete song');
            }
            return data;
        } catch (error) {
            console.error('Error deleting song:', error);
            throw error;
        }
    }

    /**
     * Deletes a playlist by ID.
     *
     * @param {string} playlistId - The ID of the playlist to delete.
     * @returns {Promise<Object>} - The response from the API.
     */
    async deletePlaylist(playlistId) {
        try {
            const response = await fetch(`/api/playlists/${playlistId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete playlist');
            }
            return data;
        } catch (error) {
            console.error('Error deleting playlist:', error);
            throw error;
        }
    }

    /**
     * Properly deletes a song
     *
     * @param {string} songId - The ID of the song to delete.
     * @returns {Promise<Object>} - The response from the API.
     */
    async properlyDeleteSong(songId) {
        try {
            const response = await fetch(`/api/songs/${songId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete song');
            }
            return data;
        } catch (error) {
            console.error('Error deleting song:', error);
            throw error;
        }
    }

    /**
     * Logs out the current user by making a request to the logout API.
     *
     * @returns {Promise<Object>} - A promise that resolves with the server's response.
     * @throws {Error} - Throws an error if the logout request fails.
     */
    async logoutUser  ()  {
        try {
            const response = await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to log out');
            }
            return await response.json();
        } catch (error) {
            throw new Error(error.message);
        }
    };

    /**
     * Admin update the profile details of a user.
     *
     * @param {string} id - The ID of the user to update.
     * @param {Object} updatedDetails - The details to update the user with.
     * @param {string} [updatedDetails.username] - The new username of the user.
     * @param {string} [updatedDetails.description] - The new description of the user.
     * @param {string} [updatedDetails.profile_picture] - The URL of the new profile picture.
     * @returns {Promise<void>} - A promise that resolves when the user profile is updated.
     * @throws {Error} - Throws an error if the request fails or if the response is not OK.
     *
     * @example
     * // Example usage:
     * const userId = '64e3f1bc9f12a61d2c5a4c58';
     * const updatedDetails = {
     *   username: 'NewUsername',
     *   description: 'Updated description',
     *   profile_picture: 'http://example.com/newprofilepic.jpg'
     * };
     * updateUserProfile(userId, updatedDetails)
     *   .then(() => console.log('User profile updated successfully'))
     *   .catch(error => console.error('Error:', error));
     *
     * @example
     * // Example response:
     * {
     *   "id": "64e3f1bc9f12a61d2c5a4c58",
     *   "username": "NewUsername",
     *   "email": "user@example.com",
     *   "profile_picture": "http://example.com/newprofilepic.jpg",
     *   "followers": ["64e3f1bc9f12a61d2c5a4c60"],
     *   "following": ["64e3f1bc9f12a61d2c5a4c61"],
     *   "playlists_created": ["64e3f1bc9f12a61d2c5a4c62"],
     *   "playlists_saved": ["64e3f1bc9f12a61d2c5a4c63"],
     *   "description": "Updated description"
     * }
     */
    async updateUserProfileAdmin(id, updatedDetails) {
        try {
            const response = await fetch(`http://localhost:3001/api/user/admin/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedDetails),
            });

            if (!response.ok) {
                throw new Error('Failed to update user');
            }

            const updatedUser = await response.json();
            return updatedUser;
        } catch (error) {
            console.error("Error updating profile:", error);
            throw error;
        }
    }

    async updateSongAdmin(id, updatedDetails) {
        try {
            const response = await fetch(`http://localhost:3001/api/song/admin/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedDetails),
            });

            if (!response.ok) {
                throw new Error('Failed to update song');
            }

            const updatedSong = await response.json();
            return updatedSong;
        } catch (error) {
            console.error("Error updating song:", error);
            throw error;
        }
    }

    /**
     * Creates a new genre.
     *
     * @param {string} genreName - The name of the genre to create.
     * @returns {Promise<Object>} - The created genre object.
     * @throws {Error} - Throws an error if the request fails.
     */
    async createGenre(genreName) {
        try {
            const response = await fetch('/api/genres', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: genreName }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create genre');
            }

            const createdGenre = await response.json();
            return createdGenre;
        } catch (error) {
            throw new Error(error.message);
        }
    }

}

const dataManager = new DataManager();
export default dataManager;


