import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import dataManager from '../utils/dataManager';
import { Validator } from "../utils/Validator";

export function AddSongForm() {
    const [formData, setFormData] = useState({ title: '',artist:'', link: '',genre: '66e377a9b13b146f637c19e8' });
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [linkUrl, setLinkUrl] = useState({});
    const [selectedGenreOption, setSelectedGenreOption] = useState('1');

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
        /*try {
            const response = await fetch(url, { method: 'GET',mode: 'no-cors' });
            if (response.ok) {
                setFormData({ ...formData, link: url });
                setLinkUrl(url);
            } else {
                throw new Error('Link not found');
            }
        } catch (error) {

            setFormData({ ...formData, link: '' });
            setLinkUrl('');
        }*/
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
        const option = e.target.value;
        const genreId = getGenreId(option);
        setSelectedGenreOption(option);
        setFormData((prevData) => ({
            ...prevData,
            genre: genreId,
        }));
    };

    const getGenreId = (option)  => {
        if(option == 1){
            return "66e377a9b13b146f637c19e8";//Pop
        }
        else if (option == 2){
            return "66e377a9b13b146f637c19e9";//Jazz
        }
        else if(option == 3){
            return "66e377a9b13b146f637c19e7";//Rock
        }
        else if (option == 4){
            return "66e377a9b13b146f637c19eb";//Rap
        }
        else if(option == 5){
            return "66e377a9b13b146f637c19ec";//Folk
        }
        else if (option == 6){
            return "66e377a9b13b146f637c19ed";//Lo-Fi
        }
        else if(option == 7){
            return "66e377a9b13b146f637c19ee";//Indie
        }
        else {
            return "66e377a9b13b146f637c19ea";//Classic
        }
    };


    return (
        <div className="container">
            <h2>Add Song</h2>
            <form onSubmit={handleFormSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input type="text" className="form-control" id="title"
                           value={formData.title} onChange={handleInputChange} name="title"/>
                    {errors.title && <p style={{color: 'red'}}>{errors.title}</p>}
                </div>
                <div className="mb-3">
                    {/*<label htmlFor="genre" className="form-label">Genre</label>
                    <input type="text" className="form-control" id="genre"
                           value={formData.genre} onChange={handleInputChange} name="genre"/>*/}
                    <label htmlFor="profile-image" className="form-label">Genre</label>
                    <select className="form-select" aria-label="Default select example"
                            id="genre"
                            name="genre"
                            value={selectedGenreOption}
                            onChange={handelGenreChange}>
                        <option value="1">Pop</option>
                        <option value="2">Jazz</option>
                        <option value="3">Rock</option>
                        <option value="4">Rap</option>
                        <option value="5">Folk</option>
                        <option value="6">Lo-Fi</option>
                        <option value="7">Indie</option>
                        <option value="8">Classic</option>
                    </select>
                    {errors.genre && <p style={{color: 'red'}}>{errors.genre}</p>}
                </div>
                <div className="mb-3">
                    <label htmlFor="artist" className="form-label">Artist</label>
                    <input type="text" className="form-control" id="artist"
                           value={formData.artist} onChange={handleInputChange} name="artist"/>
                    {errors.artist && <p style={{color: 'red'}}>{errors.artist}</p>}
                </div>
                <div className="mb-3">
                    <label htmlFor="link" className="form-label">Song Link</label>
                    <input type="text" className="form-control" id="link" name="link"
                           value={formData.link} onChange={handelUrlChange} onKeyDown={handleKeyDown}/>
                    {errors.link && <p style={{color: 'red'}}>{errors.link}</p>}
                </div>

                <button type="submit" className="btn">Add song</button>
            </form>
        </div>
    );
}
