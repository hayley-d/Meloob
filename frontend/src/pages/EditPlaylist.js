import React from 'react';
import {Link, useParams} from 'react-router-dom';
import {EditPlaylistForm} from "../components/EditPlaylistForm";


export function EditPlaylist() {
    const { id } = useParams();
    const route = `/playlist/${id}`

    return (
        <div style={{padding: '1rem'}}>
            <Link to={route} className="back-btn">Back</Link>
            <div className="container-fluid" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <EditPlaylistForm/>
            </div>
        </div>
    );

}
