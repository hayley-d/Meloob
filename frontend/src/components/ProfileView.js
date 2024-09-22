import React, {useEffect, useState} from 'react';
import dataManager from '../utils/dataManager';
import {useNavigate, useParams} from "react-router-dom";
import {Modal} from './Modal';

export function ProfileView({onFollow}) {
    const {id} = useParams();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [sessionEmail, setSessionEmail] = useState('');
    const [sessionUser, setSessionUser] = useState('');
    const [isFollowing, setIsFollowing] = useState(false);
    const navigate = useNavigate();
    const [modalShow, setModalShow] = React.useState(false);
    const [friends, setFriends] = React.useState([]);
    const [friend, setFriend] = React.useState(false);
    const [followers, setFollowers] = React.useState(false);
    const [length, setLength] = React.useState(0);

    useEffect(() => {
        const email = sessionStorage.getItem('user');
        setSessionUser(sessionStorage.getItem('userData') ? JSON.parse(sessionStorage.getItem('userData')) : '');
        setSessionEmail(email ? JSON.parse(email) : '');

        const fetchUser = async () => {
            try {
                const user = await dataManager.getUser(id);
                setUser(user);
                setLength(user.followers.length);
                const friends = await getFollowing(user.following);
                setFriends(friends);
                const followers = await getFollowers(user);
                setFollowers(followers);
                const isFriend = friends.find(user => user._id === sessionUser._id);
                if (isFriend) {
                    setFriend(true);
                }
                const isFollowing_flag = JSON.parse(sessionStorage.getItem('userData')).following.find(user => user === id);
                if(isFollowing_flag) {
                    setIsFollowing(true);
                }else{
                    setIsFollowing(false);
                }


            } catch (error) {
                console.error("Error fetching user:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    useEffect(() => {
        if (user && sessionEmail) {

        }
    }, [user, sessionEmail]);

    const handleFollow = async () => {
        try {
            const currentUser = JSON.parse(sessionStorage.getItem('userData'))
            const newInfo = await dataManager.updateUserFollowing(currentUser._id, user.id);
            setUser(newInfo);
            setIsFollowing(true);
            setLength(newInfo.followers.length);
            await onFollow(true);
            await onFollow(true);

        } catch (error) {
            console.error("Error following user:", error);
        }
    };

    const handleEditProfile = () => {
        navigate(`/edit-profile/${id}`);
    };

    const getFollowers = async (user) => {
        try {
            const followers = await dataManager.getFollowing(user.followers);
            return followers;
        } catch (error) {
            console.error("Error retrieving user's follower list:", error);
        }
    }

    const getFollowing = async () => {
        try {
            const currentUser = JSON.parse(sessionStorage.getItem('userData'))
            const following = await dataManager.getFollowing(currentUser.following);
            return following;
        } catch (error) {
            console.error("Error retrieving user's following list:", error);
        }
    }

    const handelUnfollow = async ()=>{
        setIsFollowing(false);
        await removeFollower(id);
        const updatedUser = await dataManager.getUser(id);
        setUser(updatedUser);
        setLength(updatedUser.followers.length);
        setIsFollowing(false);
        await onFollow(false);
    }

    /**
     * Removes a following from the user by calling the API.
     *
     * @function removeFollower
     */
    async function removeFollower(followerId) {
        try {
            const updateduser = await dataManager.removeFollower(sessionUser._id, followerId);
            setSessionUser(updateduser);
            sessionStorage.setItem('userData', JSON.stringify(updateduser));
        } catch (error) {
            console.error('Error removing song:', error);
        }
    }


    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>User not found</div>;
    }

    const isOwner = sessionEmail === user.email;

    return (
        <div className="container-fluid profile-page-container">
            <div className="profile-page-card">
                <div className="profile-header">
                    <div className="profile-page-picture" style={{backgroundImage: `url(${user.profile_picture})`}}></div>
                    <div>
                        <h2 className="profile-username">{user.username}</h2>
                    </div>
                    {isFollowing ? (
                        <div className="profile-stats-container">
                            <div>{user.playlists_created.length}</div>
                            <div className="follower-btn" onClick={() => setModalShow(true)}>{length}</div>
                            <div>Playlists</div>
                            <div className="follower-btn" onClick={() => setModalShow(true)}>Followers</div>
                        </div>
                    ) : ( isOwner ? (
                            <div className="profile-stats-container">
                                <div>{user.playlists_created.length}</div>
                                <div className="follower-btn" onClick={() => setModalShow(true)}>{length}</div>
                                <div>Playlists</div>
                                <div className="follower-btn" onClick={() => setModalShow(true)}>Followers</div>
                            </div>
                        ) : (
                        <div className="user-stats-container">
                            <div>{user.playlists_created.length}</div>
                            <div>{user.followers.length}</div>
                            <div>Playlists</div>
                            <div>Followers</div>
                        </div>)
                    )}
                    <div className="profile-button-container">
                        {isOwner ? (
                            <button onClick={handleEditProfile} className="edit-profile-button">Edit Profile</button>
                        ) : (
                            !isFollowing ? (
                                <button className="follow-button" onClick={handleFollow}>Follow</button>
                            ) : (
                                <button className="following-button" onClick={handelUnfollow}>Unfollow</button>
                            )
                        )}
                    </div>
                    <div>
                        {
                            isOwner ? null : (friend ? (<p>This user follows you</p>) : null)
                        }
                    </div>
                </div>
                <div className="profile-desc">
                    <p>{user.description}</p>
                </div>
            </div>
            <Modal show={modalShow} onHide={() => setModalShow(false)} friends={followers}/>
        </div>
    )
        ;
}
