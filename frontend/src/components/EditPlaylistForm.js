import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import dataManager from '../utils/dataManager';
import { Validator } from "../utils/Validator";

export function EditPlaylistForm() {
    const { id } = useParams();
    const [formData, setFormData] = useState({ name: '', description: '', hashtags: [], genre: '', cover_image: '' });
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
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
        //console.log("Form data updated:", formData);
    }, [formData]);

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
        // Split the input value by spaces and filter out any empty strings
        const hashtags = e.target.value.split(' ').filter(tag => tag.trim() !== '');
        setFormData({
            ...formData,
            hashtags,
        });
    };

    const handelGenreChange = async (e) => {
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
     * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
     */
    const handelImageChange = async (e) => {
        const url = e.target.value;

        try {
            const response = await fetch(url,  {mode: 'no-cors'});
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
            <h2>Edit Playlist</h2>
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
                    <select className="select" id="genre" name="genre" value={selectedGenreOption} onChange={handelGenreChange}>
                        <option value="1">Pop</option>
                        <option value="2">Jazz</option>
                        <option value="3">Rock</option>
                        <option value="4">Rap</option>
                        <option value="5">Folk</option>
                        <option value="6">Lo-Fi</option>
                        <option value="7">Indie</option>
                        <option value="8">Classic</option>
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
                    <input type="text" className="input" id="hashtags" name="hashtags" value={formData.hashtags.join(' ')} onChange={handleHashtagsChange}/>
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
