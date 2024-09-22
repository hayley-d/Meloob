import React from 'react';
import {Link, useParams} from 'react-router-dom';
import {AddPlaylistForm} from "../components/AddPlaylistForm";



export function AddPlaylist() {
    return (
        <div className="add-playlist-container">
            <Link to='/home' className="back-btn">Back</Link>
            <div className="container-fluid add-playlist-container-inner">
                <AddPlaylistForm/>
            </div>
        </div>
    );
}
