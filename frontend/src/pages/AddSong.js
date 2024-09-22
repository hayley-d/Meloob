import React from 'react';
import {Link} from 'react-router-dom';
import {AddSongForm} from "../components/AddSongForm";

export function AddSong() {
    return (
        <div className="add-playlist-container">
            <Link to='/home' className="back-btn">Back</Link>
            <div className="container-fluid add-playlist-container-inner">
                <AddSongForm/>
            </div>
        </div>
    );
}
