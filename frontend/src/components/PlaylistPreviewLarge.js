import React from 'react';
import dataManager from "../utils/dataManager";
import { useNavigate } from 'react-router-dom';

export function PlaylistPreviewLarge({playlist}) {
    const navigate = useNavigate();
    const user = playlist.user;

    const hashtags = playlist.hashtags.map((tag, index) => (
        <span key={index} className='hashtag' style={{ cursor: "pointer", color: "#ff70a6" }} onClick={() => handleHashtagClick(tag)}>{`#${tag} `}</span>
    ));

    const goToUserProfile = () => {navigate(`/profile/${playlist.user.id}`);}

    const goToPlaylist = () => {
        navigate(`/playlist/${playlist.id}`);
    }

    const handleHashtagClick = (tag) => {
        navigate(`/browse?search=${tag}`);
    }

    return (
        <div  className="playlist-large-card-container shadow-lg p-3 mb-5 bg-body-tertiary rounded">
            <div className="playlist-card-header">
                <div className="pl-card-div-1">
                    <img className="playlist-card-pp" src={playlist.user['profile_picture']} alt={playlist.user.username}/>
                </div>
                <div>
                    <h4 onClick={goToUserProfile} className="playlist-large-card-username"> {playlist.user.username}</h4>
                </div>
                <div>
                    <p className="playlist-card-date">{playlist.date_created}</p>
                </div>
            </div>

            <div className="playlist-large-genre-container">
                <div className="created-playlist-action">Created</div>
                <div className="playlist-genre">{playlist.genre}</div>
            </div>

            <div  className="playlist-large-sub-card">
                <img onClick={goToPlaylist} className="playlist-large-image" src={playlist.coverImage} alt={playlist.name}/>
                <h5  onClick={goToPlaylist} className="playlist-large-card-title">{playlist.name}</h5>
                <p className="card-text">{playlist.description}{hashtags}</p>
            </div>

        </div>
    );
}


