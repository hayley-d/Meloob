import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import dataManager from '../utils/dataManager';
import { Validator } from "../utils/Validator";

export function EditPlaylistForm() {
    const { id } = useParams();
    const [formData, setFormData] = useState({ name: '', description: '', hashtags: [], genre: '', cover_image: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [genres, setGenres] = useState([]);
    const [hashtags, setHashtags] = useState('');
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [coverImageUrl, setCoverImageUrl] = useState('https://opensource.com/sites/default/files/lead-images/rust_programming_crab_sea.png');
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
                    genre: '66e377a9b13b146f637c19e7',
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

                setSelectedGenreOption(formData.genre)
                setHashtags(formData.hashtags.join(' '))
            } catch (error) {
                console.error("Error fetching genres:", error);
            }
        };

        fetchGenres();
    }, [isLoading]);


    /**
     * Handle changes to input fields.
     * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e - The change event.
     */
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    /**
     * Handle changes to the hashtag input field.
     * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
     */
    const handleHashtagsChange = (e) => {
        const hashtags = e.target.value.split(' ').filter(tag => tag.trim() !== '');
        setFormData({
            ...formData,
            hashtags,
        });
        setHashtags(e.target.value)
    };

    const handelGenreChange = (e) => {
        const genreId = e.target.value;
        setSelectedGenreOption(genreId);
        //console.log(genreId);
        setFormData((prevData) => ({
            ...prevData,
            genre: genreId,
        }));
    };

    /**
     * Handle form submission.
     * @param {React.FormEvent<HTMLFormElement>} e - The submit event.
     */
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const formt_hashtags = hashtags.split(' ').filter(tag => tag.trim() !== '');
        setFormData({
            ...formData,
            hashtags: formt_hashtags,
        });
        const validationErrors = Validator.validateEditPlaylist(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

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
     * Validate if the input URL is a valid URL.
     * @param {string} url - The URL to validate.
     * @returns {boolean} - True if the URL is valid, false otherwise.
     */
    const isValidUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch (_) {
            return false;
        }
    };

    /**
     * Handle changes to the cover image input field.
     * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
     */
    const handelImageChange = async (e) => {
        const url = e.target.value;

        if (!isValidUrl(url)) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                coverImage: 'Invalid URL format',
            }));
            setCoverImageUrl('https://opensource.com/sites/default/files/lead-images/rust_programming_crab_sea.png');
            return;
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, coverImage: null }));
        }

        try {
            const response = await fetch(url, { mode: 'no-cors' });
            if (response.ok || response.type === 'opaque') {
                setFormData({ ...formData, coverImage: url });
                setCoverImageUrl(url);
            } else {
                throw new Error('Image not found');
            }
        } catch (error) {

            setErrors((prevErrors) => ({
                ...prevErrors,
                coverImage: 'Image not found at the provided URL',
            }));
            setFormData({ ...formData, coverImage: '' });
            setCoverImageUrl('https://opensource.com/sites/default/files/lead-images/rust_programming_crab_sea.png');
        }
    };


    /**
     * Handle key down events in the hashtags input field.
     * @param {React.KeyboardEvent<HTMLInputElement>} e - The keyboard event.
     */
    const handleKeyDown = (e) => {
        if (e.key === 'Backspace') {
            e.preventDefault();
            setFormData({
                ...formData,
                coverImage: ''
            });
        }
    };

    async function deletePlaylist (e) {
        e.preventDefault();
        await dataManager.deletePlaylist(id);
        navigate(`/home`);
    }


    return (
        <div className="container">
            <h2 className="form-heading">Edit Playlist</h2>
            <form>
                <div className="image-container">
                    <div className="form-profile-image" style={{backgroundImage: `url(${coverImageUrl})`,}}></div>
                </div>
                <div className="input-group">
                    <label htmlFor="name" className="label">Name</label>
                    <input type="text" className="input" id="name" value={formData.name} onChange={handleInputChange} name="name"/>
                    {errors.name && <p className="error-message">{errors.name}</p>}
                </div>
                <div className="input-group">
                    <label htmlFor="genre" className="label">Genre</label>
                    <select className="select" id="genre" name="genre" value={selectedGenreOption}
                            onChange={handelGenreChange}>
                        {genres.map((genre, index) => (
                            <option key={index} value={genre._id}>{genre.name}</option>
                        ))}
                    </select>
                    {errors.genre && <p className="error-message">{errors.genre}</p>}
                </div>
                <div className="input-group">
                    <label htmlFor="description" className="label">Description</label>
                    <textarea className="textarea" id="description" name="description" rows="3" value={formData.description} onChange={handleInputChange}></textarea>
                    {errors.description && <p className="error-message">{errors.description}</p>}
                </div>
                <div className="input-group">
                    <label htmlFor="hashtags" className="label">Hashtags (space-separated)</label>
                    <input type="text" className="input" id="hashtags" name="hashtags" value={hashtags} onChange={handleHashtagsChange}/>
                    {errors.hashtags && <p className="error-message">{errors.hashtags}</p>}
                </div>
                <div className="input-group">
                    <label htmlFor="coverImage" className="label">Cover Image URL</label>
                    <input type="text" className="input" id="coverImage" name="coverImage" value={formData.coverImage} onChange={handelImageChange} onKeyDown={handleKeyDown}/>
                    {errors.coverImage && <p className="error-message">{errors.coverImage}</p>}
                </div>

                <div className="double-button-container">
                    <button onClick={handleFormSubmit} className="button">Save Changes</button>
                    <button onClick={deletePlaylist} className="button-red">Delete</button>
                </div>
            </form>
        </div>
    );
}
