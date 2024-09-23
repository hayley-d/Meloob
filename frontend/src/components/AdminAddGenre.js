import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import dataManager from '../utils/dataManager';

export function AdminAddGenre() {
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setName(e.target.value);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            await dataManager.createGenre(name);
            navigate(`/home`);
        } catch (error) {
            console.error("Error adding genre:", error);
        }
    };

    return (
        <div className="genre-container">
            <form onSubmit={handleFormSubmit}>
                <h2 className="form-heading-genre">Add Genre</h2>
                <div className="input-group-genre">
                    <div><label htmlFor="name" className="label">Name</label></div>
                    <div>
                        <input type="name" className="input-genre" id="name" value={name} onChange={handleInputChange} name="name"/>
                    </div>
                </div>
                <div className="button-container">
                    <button type="submit" className="button button-genre">Add</button>
                </div>
            </form>
        </div>
    );
}
