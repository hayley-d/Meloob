import React from 'react';
import {Link, useParams} from 'react-router-dom';
import {AddPlaylistForm} from "../components/AddPlaylistForm";



export function AddPlaylist() {
    return (
        <div style={{padding: '1rem'}}>
            <Link to='/home' className="back-btn">Back</Link>
            <div className="container-fluid" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <AddPlaylistForm/>
            </div>
        </div>
    );
}
