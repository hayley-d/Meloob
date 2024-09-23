import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import dataManager from '../utils/dataManager';
import { Validator } from "../utils/Validator";
import '../../public/assets/css/FormStyles.css';

export function AddSongForm() {
    const [formData, setFormData] = useState({ title: '',artist:'', link: '',genre: '66e377a9b13b146f637c19e8' });
    const navigate = useNavigate();
    const [genres, setGenres] = useState([]);
    const [errors, setErrors] = useState({});
    const [linkUrl, setLinkUrl] = useState({});
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
     * Handle form submission.
     * @param {React.FormEvent<HTMLFormElement>} e - The submit event.
     */
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = Validator.validateAddSong(formData);
        if (!isValidSpotifyLink(formData.link)) {
            validationErrors.link = "Please enter a valid Spotify link.";
        }
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const response = await dataManager.addSong(formData);
            navigate(`/home`);
        } catch (error) {
            console.error("Error adding song:", error);
        }
    };

    /**
     * Handle changes to the cover image input field.
     * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
     */
    const handelUrlChange = async (e) => {
        const url = e.target.value;
        setFormData({ ...formData, link: url });
        setLinkUrl(url);
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
                link: ''
            });
        }
    };

    /**
     * Validate that the provided link is a valid Spotify URL.
     * @param {string} url - The URL to validate.
     * @returns {boolean} - True if the URL is valid, false otherwise.
     */
    const isValidSpotifyLink = (url) => {
        const spotifyUrlRegex = /^(https:\/\/open\.spotify\.com\/(track|album)\/[a-zA-Z0-9]+)(\?.*)?$/;
        return spotifyUrlRegex.test(url);
    };

    const handelGenreChange = (e) => {
        const genreId = e.target.value;
        setSelectedGenreOption(genreId);
        setFormData((prevData) => ({
            ...prevData,
            genre: genreId,
        }));
    };


    return (
        <div className="container">
            <h2 className="form-heading">Add Song</h2>
            <form onSubmit={handleFormSubmit}>
                <div className="input-group">
                    <label htmlFor="title" className="label">Title</label>
                    <input type="text" className="input" id="title" value={formData.title} onChange={handleInputChange} name="title"/>
                    {errors.title && <p className="error-message">{errors.title}</p>}
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
                    <label htmlFor="artist" className="label">Artist</label>
                    <input type="text" className="input" id="artist" value={formData.artist} onChange={handleInputChange} name="artist"/>
                    {errors.artist && <p className="error-message">{errors.artist}</p>}
                </div>
                <div className="input-group">
                    <label htmlFor="link" className="label">Song Link</label>
                    <input type="text" className="input" id="link" name="link" value={formData.link} onChange={handelUrlChange} onKeyDown={handleKeyDown}/>
                    {errors.link && <p className="error-message">{errors.link}</p>}
                </div>
                <div className="button-container">
                    <button type="submit" className="button">Add song</button>
                </div>
            </form>
        </div>
    );
}
