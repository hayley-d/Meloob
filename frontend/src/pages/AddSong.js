import React from 'react';
import {Link} from 'react-router-dom';
import {AddSongForm} from "../components/AddSongForm";

export function AddSong() {
    return (
        <div style={{padding: '1rem'}}>
            <Link to='/home' className="back-btn">Back</Link>
            <div className="container-fluid" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <AddSongForm/>
            </div>
        </div>
    );
}
