import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dataManager from '../utils/dataManager';
import { Validator } from "../utils/Validator";


export function AddPlaylistForm() {
    const getCurrentDate = () => {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    };

    const [formData, setFormData] = useState({ userId: JSON.parse(sessionStorage.getItem('userData'))._id,coverImage: 'https://opensource.com/sites/default/files/lead-images/rust_programming_crab_sea.png',date_created:getCurrentDate(), genre: '66e377a9b13b146f637c19e8',name: 'new Playlist', description: '', hashtags: [], songs:[] });
    const navigate = useNavigate();
    const [genres, setGenres] = useState([]);
    const [errors, setErrors] = useState({});
    const [coverImageUrl, setCoverImageUrl] = useState('https://opensource.com/sites/default/files/lead-images/rust_programming_crab_sea.png');
    const [selectedGenreOption, setSelectedGenreOption] = useState('1');

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
     * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e - The change event.
     */
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    /**
     * Handle changes to the hashtags input field.
     * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
     */
    const handleHashtagsChange = (e) => {
        const hashtags = e.target.value.split(' ').filter(tag => tag.trim() !== '');
        setFormData({
            ...formData,
            hashtags,
        });
    };

    /**
     * Handle form submission.
     * @param {React.FormEvent<HTMLFormElement>} e - The submit event.
     */
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = Validator.validateEditPlaylist(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const response = await dataManager.addPlaylist(formData.userId,formData);
            navigate(`/home`);
        } catch (error) {
            console.error("Error adding playlist:", error);
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
            console.error('Error loading image:', error);
            setErrors((prevErrors) => ({
                ...prevErrors,
                coverImage: 'Image not found at the provided URL',
            }));
            setFormData({ ...formData, coverImage: '' });
            setCoverImageUrl('https://octodex.github.com/images/vinyltocat.png');
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

    const handelGenreChange = (e) => {
        const genreId = e.target.value;
        setSelectedGenreOption(genreId);
        setFormData((prevData) => ({
            ...prevData,
            genre: genreId,
        }));
    };


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


    return (
        <div className="container">
            <h2 className="form-heading">Add Playlist</h2>
            <form onSubmit={handleFormSubmit}>
                <div className="image-container">
                    <div className="add-playlist-image" style={{backgroundImage: `url(${coverImageUrl})`}}></div>
                </div>

                <div className="input-group">
                    <label htmlFor="name" className="label">Name</label>
                    <input type="text" className={`input ${errors.name ? "input-error" : ""}`} id="name" value={formData.name} onChange={handleInputChange} name="name"/>
                    {errors.name && <p className="error-message">{errors.name}</p>}
                </div>
                <div className="input-group">
                    <label htmlFor="profile-image" className="label">Genre</label>
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
                    <textarea className="textarea" id="description" name="description" rows="3"
                              value={formData.description} onChange={handleInputChange}></textarea>
                    {errors.description && <p className="error-message">{errors.description}</p>}
                </div>
                <div className="input-group">
                    <label htmlFor="hashtags" className="label">Hashtags (space-separated)</label>
                    <input type="text" className={`input ${errors.hashtags ? "input-error" : ""}`} id="hashtags" name="hashtags"
                           value={formData.hashtags.join(' ')} onChange={handleHashtagsChange}/>
                    {errors.hashtags && <p style={{color: 'red'}}>{errors.hashtags}</p>}
                </div>
                <div className="input-group">
                    <label htmlFor="coverImage" className="label">Cover Image URL</label>
                    <input type="text" className={`input ${errors.coverImage ? "input-error" : ""}`} id="coverImage" name="coverImage" value={formData.coverImage} onChange={handelImageChange} onKeyDown={handleKeyDown}/>
                    {errors.coverImage && <p className="error-message">{errors.coverImage}</p>}
                </div>
                <div className="button-container">
                    <button type="submit" className="button">Create Playlist</button>
                </div>


            </form>
        </div>
    );
}
