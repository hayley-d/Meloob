import React from 'react';
import {Link, useParams} from 'react-router-dom';
import {EditPlaylistForm} from "../components/EditPlaylistForm";


export function EditPlaylist() {
    const { id } = useParams();
    const route = `/playlist/${id}`

    return (
        <div className="add-playlist-container">
            <Link to={route} className="back-btn">Back</Link>
            <div className="container-fluid defalut-container">
                <EditPlaylistForm/>
            </div>
        </div>
    );

}
