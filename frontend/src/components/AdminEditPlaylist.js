import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dataManager from '../utils/dataManager';

export function AdminEditPlaylist({id}) {
    const [formData, setFormData] = useState({ name: '', description: '', hashtags: [], genre: '', coverImage: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [genres, setGenres] = useState([]);
    const navigate = useNavigate();
    const [coverImageUrl, setCoverImageUrl] = useState('https://octodex.github.com/images/vinyltocat.png');
    const [selectedGenreOption, setSelectedGenreOption] = useState('1');

    useEffect(() => {
        /**
         * Fetch playlist data by ID and set it to the form state.
         */
        const fetchPlaylist = async () => {
            try {
                const playlist = await dataManager.getPlaylistByID(id);
                setFormData({
                    name: playlist.name,
                    description: playlist.description,
                    hashtags: playlist.hashtags,
                    genre: playlist.genre,
                    coverImage: playlist.coverImage,
                });
                setCoverImageUrl(playlist.coverImage);
            } catch (error) {
                console.error("Error fetching playlist:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlaylist();
    }, [id]);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const fetchedGenres = await dataManager.getGenres();
                setGenres(fetchedGenres);
            } catch (error) {
                console.error("Error fetching genres:", error);
            }
        };

        fetchGenres();
    }, []);

    /**
     * Handle changes to input fields.
     */
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    /**
     * Handle changes to the hashtag input field.
     */
    const handleHashtagsChange = (e) => {
        const hashtags = e.target.value.split(' ').filter(tag => tag.trim() !== '');
        setFormData({
            ...formData,
            hashtags,
        });
    };

    const handleGenreChange = (e) => {
        const genreId = e.target.value;
        setSelectedGenreOption(genreId);
        setFormData((prevData) => ({
            ...prevData,
            genre: genreId,
        }));
    };

    /**
     * Handle form submission.
     */
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            await dataManager.updatePlaylist(id, formData);
            navigate(`/playlist/${id}`);
        } catch (error) {
            console.error("Error updating playlist:", error);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    /**
     * Handle changes to the cover image input field.
     */
    const handleImageChange = async (e) => {
        const url = e.target.value;

        try {
            const response = await fetch(url, { mode: 'no-cors' });
            if (response.ok) {
                setFormData({ ...formData, coverImage: url });
                setCoverImageUrl(url);
            } else {
                throw new Error('Image not found');
            }
        } catch (error) {
            console.error('Error loading image:', error);
            setFormData({ ...formData, coverImage: '' });
            setCoverImageUrl('https://octodex.github.com/images/vinyltocat.png');
        }
    };

    return (
        <div className="container">
            <h2 className="form-heading">Edit Playlist</h2>
            <form>
                <div className="image-container">
                    <div className="form-profile-image" style={{ backgroundImage: `url(${coverImageUrl})` }}></div>
                </div>
                <div className="input-group">
                    <label htmlFor="name" className="label">Name</label>
                    <input type="text" className="input" id="name" value={formData.name} onChange={handleInputChange} name="name" />
                </div>
                <div className="input-group">
                    <label htmlFor="genre" className="label">Genre</label>
                    <select className="select" id="genre" name="genre" value={selectedGenreOption} onChange={handleGenreChange}>
                        {genres.map((genre,index) => (
                            <option key={index} value={genre._id}>{genre.name}</option>
                        ))}
                    </select>
                </div>
                <div className="input-group">
                    <label htmlFor="description" className="label">Description</label>
                    <textarea className="textarea" id="description" name="description" rows="3" value={formData.description} onChange={handleInputChange}></textarea>
                </div>
                <div className="input-group">
                    <label htmlFor="hashtags" className="label">Hashtags (space-separated)</label>
                    <input type="text" className="input" id="hashtags" name="hashtags" value={formData.hashtags.join(' ')} onChange={handleHashtagsChange} />
                </div>
                <div className="input-group">
                    <label htmlFor="coverImage" className="label">Cover Image URL</label>
                    <input type="text" className="input" id="coverImage" name="coverImage" value={formData.coverImage} onChange={handleImageChange} />
                </div>

                <div className="double-button-container">
                    <button onClick={handleFormSubmit} className="button">Save Changes</button>
                </div>
            </form>
        </div>
    );
}
