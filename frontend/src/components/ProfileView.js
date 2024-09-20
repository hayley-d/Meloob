import React, {useEffect, useState} from 'react';
import dataManager from '../utils/dataManager';
import {useNavigate, useParams} from "react-router-dom";

export function ProfileView() {
    const {id} = useParams();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [sessionEmail, setSessionEmail] = useState('');
    const [sessionUser, setSessionUser] = useState('');
    const [isFollowing, setIsFollowing] = useState(false);
    const navigate = useNavigate(); // Use navigate for redirection

    useEffect(() => {
        const email = sessionStorage.getItem('user');
        setSessionUser(sessionStorage.getItem('userData') ? JSON.parse(sessionStorage.getItem('userData')): '');
        setSessionEmail(email ? JSON.parse(email) : '');

        const fetchUser = async () => {
            try {
                const user = await dataManager.getUser(id);
                console.log("User retrieved:", user); // Log the retrieved user
                setUser(user);
            } catch (error) {
                console.error("Error fetching user:", error);
            } finally {
                setIsLoading(false); // Set loading to false regardless of success or failure
            }
        };

        fetchUser();
    }, [id]);

    useEffect(() => {
        if (user && sessionEmail) {
            console.log("Current Email:", sessionEmail);
            console.log("Profile Email:", user.email);
        }
    }, [user, sessionEmail]);

    const handleFollow = async () => {
        try {
            // Fetch the logged-in user from session storage
            const currentUser = JSON.parse(sessionStorage.getItem('userData'))
            console.log("Retrieved",currentUser)
            const newInfo = await dataManager.updateUserFollowing(currentUser._id,user.id);
            setUser(newInfo);
            setIsFollowing(true);
            console.log("Followed user successfully!");

        } catch (error) {
            console.error("Error following user:", error);
        }
    };

    const handleEditProfile = () => {
        navigate(`/edit-profile/${id}`);
    };


    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>User not found</div>;
    }

    // Check if the logged-in user is the same as the profile user
    const isOwner = sessionEmail === user.email;
    //const isFollowing = sessionUser ? sessionUser.following.includes(user.id) : false;

    return (
        <div className="container-fluid" style={{
            marginTop: "30px",
            marginBottom: "30px",
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: "100vw",
            justifyContent: "center",
            height: "fit-content"
        }}>
            <div className="profile-card" style={{
                display: "flex",
                flexDirection: "column",
                gap: "30px",
                justifyContent: "center",
            }}>
                <div className="profile-header" style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 3fr",
                    gridTemplateRows: "1fr 1fr 1fr",
                    gap: "30px"
                }}>
                    <div className="profile-user-img"
                         style={{gridRow: "span 3", backgroundImage: `url(${user.profile_picture})`}}></div>
                    <div><h2 style={{fontSize: "30px", fontWeight: "bold"}}>{user.username}</h2></div>
                    <div style={{
                        display: "grid", gridTemplateColumns: "1fr 1fr",
                        gridTemplateRows: "1fr 1fr",
                        gap: "10px",
                        fontSize: "20px"
                    }}>
                        <div>{user.playlists_created.length}</div>
                        <div className="follower-btn">{user.followers.length}</div>
                        <div>Playlists</div>
                        <div className="follower-btn">Followers</div>
                    </div>
                    <div style={{display: "flex", alignItems: "center", justifyContent: "left"}}>
                        {isOwner ? (
                            <button onClick={handleEditProfile} className="btn" style={{backgroundColor: "#ff70a6", color: "white"}}>Edit
                                Profile</button>
                        ) : (
                            !isFollowing ? (
                                <button className="btn" style={{backgroundColor: "#70d6ff", color: "white"}}
                                        onClick={handleFollow}>Follow</button>
                            ) : (
                                <button className="btn" style={{backgroundColor: "grey", color: "white"}}>Following</button>
                            )
                        )}
                    </div>
                </div>
                <div className="profile-desc" style={{fontSize: "20px"}}>
                    <p>{user.description}</p>
                </div>
            </div>
        </div>
    );
}
