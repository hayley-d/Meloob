import React, {useState} from 'react';
import dataManager from "../utils/dataManager";
import {useNavigate} from 'react-router-dom';
import {CommentContainer} from "./CommentContainer";
import {AddComment} from "./AddComment";


export function PlaylistPreviewFull({playlist,onUpdate}) {
    const navigate = useNavigate();
    const user = playlist.user;
    const [saved, setSaved] = useState(() => {
        const currentUser = JSON.parse(sessionStorage.getItem("userData"));
        return !!currentUser.playlists_saved.find((p) => p === playlist.id);
    });

    const hashtags = playlist.hashtags.map((tag, index) => (
        <span key={index} className='hashtag'>{`#${tag} `}</span>
    ));

    const goToUserProfile = () => {
        navigate(`/profile/${playlist.user._id}`);
    }

    const isOwner = user._id === JSON.parse(sessionStorage.getItem("userData"))._id;

    const toggleSave = async () => {
        try {
            const updatedSavedState = await dataManager.updateUserSavedPlaylist(JSON.parse(sessionStorage.getItem("userData"))._id, playlist.id);
            setSaved(updatedSavedState);
        } catch (error) {
            console.error("Error saving playlist:", error);
        }
    };

    const toggleEdit = () => {
        navigate(`/edit-playlist/${playlist.id}`);
    }

    const handleAddComment = async (commentData) => {
        try {
            const newComment = await dataManager.addComment(playlist.id, commentData);
            await onUpdate();
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    return (
        <div className="playlist-full-card">
            <div className="playlist-full-card-header">
                <div>
                    {/*empty for design purposes*/}
                </div>
                <div className="playlist-full-card-header-svg">
                    <div>
                        {isOwner ? (
                            <svg onClick={toggleEdit} xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#28282f" className="bi bi-three-dots" viewBox="0 0 16 16">
                                <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
                            </svg>
                        ) : (saved ? (
                                    <svg onClick={toggleSave} xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#28282f" className="bi bi-bookmark-heart-fill" viewBox="0 0 16 16">
                                        <path d="M2 15.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2zM8 4.41c1.387-1.425 4.854 1.07 0 4.277C3.146 5.48 6.613 2.986 8 4.412z"/>
                                    </svg>
                                )
                                : (
                                    <svg onClick={toggleSave} xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#28282f" className="bi bi-bookmark-heart" viewBox="0 0 16 16">
                                        <path style={{fillRule: "evenodd"}} d="M8 4.41c1.387-1.425 4.854 1.07 0 4.277C3.146 5.48 6.613 2.986 8 4.412z"/>
                                        <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z"/>
                                    </svg>
                                )
                        )}
                    </div>
                </div>
                <div className="playlist-full-card-name-container">
                    <h3 className="playlist-full-card-name">{playlist.name}</h3>
                </div>
                <div className="playlist-full-card-genre-container">
                    <div className="playlist-full-card-genre-tag">
                        <p className="playlist-full-card-genre">{playlist.genre}</p>
                    </div>
                </div>
                <div>
                    <p onClick={goToUserProfile} className="playlist-full-user-link">Created By {playlist.user.username} on {playlist.date_created}</p>
                </div>
            </div>
            <div>
                <img className=" playlist-full-card-picture" src={playlist.coverImage} alt={playlist.name}/>
            </div>

            <div className="playlist-full-description-container">
                <p className="playlist-full-description">{playlist.description}{hashtags}</p>
            </div>

            <div>
                <h4>Comments</h4>
                <CommentContainer comments={playlist.comments} />
            </div>

            <AddComment onComment={handleAddComment}/>


        </div>
    );
}


