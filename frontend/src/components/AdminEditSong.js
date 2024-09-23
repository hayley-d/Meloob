import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import dataManager from '../utils/dataManager';
import { Validator } from "../utils/Validator";

export function AdminEditSong({song}) {
    const [formData, setFormData] = useState({ title: song.title, artist: song.artist, link: song.link, genre: '' });
    const [genres, setGenres] = useState([]);
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [linkUrl, setLinkUrl] = useState({});
    const [selectedGenreOption, setSelectedGenreOption] = useState('');

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await dataManager.getGenres();
                setGenres(response);
                if (response.length > 0) {
                    setSelectedGenreOption(response[0].id);
                }
            } catch (error) {
                console.error("Error fetching genres:", error);
            }
        };

        fetchGenres();
    }, []);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

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
            await dataManager.updateSongAdmin(song.id,formData);
            navigate(`/home`);
        } catch (error) {
            console.error("Error adding song:", error);
        }
    };

    const handelUrlChange = async (e) => {
        const url = e.target.value;
        setFormData({ ...formData, link: url });
        setLinkUrl(url);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Backspace') {
            e.preventDefault();
            setFormData({
                ...formData,
                link: ''
            });
        }
    };

    const isValidSpotifyLink = (url) => {
        const spotifyUrlRegex = /^(https:\/\/open\.spotify\.com\/(track|album)\/[a-zA-Z0-9]+)(\?.*)?$/;
        return spotifyUrlRegex.test(url);
    };

    const handelGenreChange = (e) => {
        const option = e.target.value;
        setSelectedGenreOption(option);
        setFormData((prevData) => ({...prevData, genre: option,}));
    };

    return (
        <div className="container">
            <h2 className="form-heading">Edit Song</h2>
            <form onSubmit={handleFormSubmit}>
                <div className="input-group">
                    <label htmlFor="title" className="label">Title</label>
                    <input type="text" className="input" id="title" value={formData.title} onChange={handleInputChange} name="title" />
                </div>
                <div className="input-group">
                    <label htmlFor="genre" className="label">Genre</label>
                    <select className="select" id="genre" name="genre" value={selectedGenreOption} onChange={handelGenreChange}>
                        {genres.map((genre,index) => (
                            <option key={index} value={genre._id}>{genre.name}</option>
                        ))}
                    </select>
                </div>
                <div className="input-group">
                    <label htmlFor="artist" className="label">Artist</label>
                    <input type="text" className="input" id="artist" value={formData.artist} onChange={handleInputChange} name="artist" />
                </div>
                <div className="input-group">
                    <label htmlFor="link" className="label">Song Link</label>
                    <input type="text" className="input" id="link" name="link" value={formData.link} onChange={handelUrlChange} onKeyDown={handleKeyDown} />
                </div>
                <div className="button-container">
                    <button type="submit" className="button">Save</button>
                </div>
            </form>
        </div>
    );
}
