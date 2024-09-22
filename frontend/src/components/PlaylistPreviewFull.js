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


    // Create a string of hashtags
    const hashtags = playlist.hashtags.map((tag, index) => (
        <span key={index} className='hashtag'>{`#${tag} `}</span>
    ));

    const goToUserProfile = () => {
        console.log("Go to user");
        navigate(`/profile/${playlist.user._id}`);
    }

    const isOwner = user._id === JSON.parse(sessionStorage.getItem("userData"))._id;

    const toggleSave = async () => {
        try {
            const updatedSavedState = await dataManager.updateUserSavedPlaylist(JSON.parse(sessionStorage.getItem("userData"))._id, playlist.id);
            console.log("Updated saved",updatedSavedState);
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
            //console.log("Making comment");
            const newComment = await dataManager.addComment(playlist.id, commentData);
            await onUpdate();
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    return (
        <div style={{
            width: 'fit-content',
            display: 'flex',
            flexDirection: "column",
            justifyContent: 'center',
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "20px"
        }}>
            <div style={{display: "grid", gridTemplateRows: "1fr 2fr 1fr", gridTemplateColumns: "2fr 1fr",}}>
                <div>
                    {/*empty for design purposes*/}
                </div>
                <div style={{display: "flex", justifyContent: "right"}}>
                    <div>
                        {isOwner ? (<svg onClick={toggleEdit} xmlns="http://www.w3.org/2000/svg" width="40" height="40"
                                         fill="#28282f"
                                         className="bi bi-three-dots" viewBox="0 0 16 16">
                            <path
                                d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
                        </svg>) : (saved ? (
                                <svg onClick={toggleSave} xmlns="http://www.w3.org/2000/svg" width="30" height="30"
                                     fill="#28282f"
                                     className="bi bi-bookmark-heart-fill" viewBox="0 0 16 16">
                                    <path
                                        d="M2 15.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2zM8 4.41c1.387-1.425 4.854 1.07 0 4.277C3.146 5.48 6.613 2.986 8 4.412z"/>
                                </svg>) : (
                                <svg onClick={toggleSave} xmlns="http://www.w3.org/2000/svg" width="30" height="30"
                                     fill="#28282f"
                                     className="bi bi-bookmark-heart" viewBox="0 0 16 16">
                                    <path style={{fillRule: "evenodd"}}
                                          d="M8 4.41c1.387-1.425 4.854 1.07 0 4.277C3.146 5.48 6.613 2.986 8 4.412z"/>
                                    <path
                                        d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z"/>
                                </svg>)
                        )}

                    </div>
                </div>
                <div style={{display: "flex", alignItems: "center"}}>
                    <h3 style={{fontWeight: "bold", fontSize: "30px", color: "#28282f"}}>{playlist.name}</h3>
                </div>
                <div style={{display: "flex", justifyContent: "right", padding: "10px"}}>
                    <div style={{
                        backgroundColor: "#ff70a6",
                        color: "white",
                        borderRadius: "10px",
                        textAlign: "center",
                        padding: "10px",
                        height: "5vh"
                    }}>
                        <p style={{
                            fontSize: "20px",
                            textAlign: "center",
                        }}>{playlist.genre}</p>
                    </div>
                </div>

                <div>
                    <p onClick={goToUserProfile}
                       style={{gridColumn: "span 2", fontSize: "20px", color: "#28282f", cursor: "pointer"}}>Created
                        By {playlist.user.username} on {playlist.date_created}</p>
                </div>
            </div>

            <div>
                <img className=" playlist-card-picture" style={{borderRadius: "20px", height: "50vh"}}
                     src={playlist.coverImage}
                     alt={playlist.name}/>
            </div>

            <div style={{marginTop: "30px", marginBottom: "30px"}}>
                <p style={{fontSize: "18px", color: "#28282f"}}>{playlist.description}{hashtags}</p>
            </div>

            <div>
                <h4>Comments</h4>
                <CommentContainer comments={playlist.comments} />
            </div>

            <AddComment onComment={handleAddComment}/>


        </div>
    );
}


