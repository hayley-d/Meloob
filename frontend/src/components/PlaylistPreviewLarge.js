import React from 'react';
import dataManager from "../utils/dataManager";
import { useNavigate } from 'react-router-dom';



export function PlaylistPreviewLarge({playlist}) {
    const navigate = useNavigate();
    const user = playlist.user;

    // Create a string of hashtags
    const hashtags = playlist.hashtags.map((tag, index) => (
        <span key={index} className='hashtag'>{`#${tag} `}</span>
    ));

    const goToUserProfile = () => {
        console.log("Go to user");
        navigate(`/profile/${playlist.user.id}`);
    }

    const goToPlaylist = () => {
        navigate(`/playlist/${playlist.id}`);
    }

    return (
        <div  className="playlist-card shadow-lg p-3 mb-5 bg-body-tertiary rounded" style={{width: '18rem'}}>
            <div className="playlist-card-header">
                <div className="pl-card-div-1"><img className="playlist-card-pp"
                                                    src={playlist.user['profile_picture']}
                                                    alt={playlist.user.username}/></div>
                <div><h4 onClick={goToUserProfile} className="playlist-card-username"
                         style={{cursor: "pointer", fontSize: "20px"}}> {playlist.user.username}</h4></div>
                <div><p className="playlist-card-date">{playlist.date_created}</p></div>
            </div>

            <div style={{display: "flex", gap: ".7rem", height: "10%", marginTop: "10px", marginBottom: "10px"}}>
                <div className="created-playlist-action">Created</div>
                <div className="playlist-genre">{playlist.genre}</div>
            </div>

            <div onClick={goToPlaylist} className="card-body playlist-card-body">
                <img className=" playlist-card-picture" style={{borderRadius: "20px"}} src={playlist.coverImage}
                     alt={playlist.name}/>
                <h5 className="card-title" style={{
                    color: "#28282f",
                    fontSize: "25px",
                    marginTop: "18px",
                    marginBottom: "18px",
                    fontWeight: "bold"
                }}>{playlist.name}</h5>
                <p className="card-text">{playlist.description}{hashtags}</p>
            </div>

        </div>
    );
}


