import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import dataManager from '../utils/dataManager';
import { Validator } from "../utils/Validator";

export function AddSongForm() {
    const [formData, setFormData] = useState({ title: '',artist:'', link: '',genre: '' });
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [linkUrl, setLinkUrl] = useState({});

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
                    <label htmlFor="genre" className="form-label">Genre</label>
                    <input type="text" className="form-control" id="genre"
                           value={formData.genre} onChange={handleInputChange} name="genre"/>
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
