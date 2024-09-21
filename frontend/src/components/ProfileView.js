import React, {useEffect, useState} from 'react';
import dataManager from '../utils/dataManager';
import {useNavigate, useParams} from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function MyVerticallyCenteredModal(props) {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Following
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{fontSize: "16px"}}>
                {
                    props.friends.length > 0 ? (
                        props.friends.map((friend, index) => (
                            <p key={index}>
                                {friend.username}
                            </p>
                        ))
                    ) : (
                        <p>No friends found</p>
                    )
                }
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

export function ProfileView() {
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

        } catch (error) {
            console.error("Error following user:", error);
        }
    };

    const handleEditProfile = () => {
        navigate(`/edit-profile/${id}`);
    };

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
            console.log(updateduser);
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
                    {isOwner ? (
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gridTemplateRows: "1fr 1fr",
                            gap: "10px",
                            fontSize: "20px"
                        }}>
                            <div>{user.playlists_created.length}</div>
                            <div className="follower-btn"
                                 style={{cursor: "pointer"}}
                                 onClick={() => setModalShow(true)}>{length}</div>
                            <div>Playlists</div>
                            <div className="follower-btn" style={{cursor: "pointer"}}
                                 onClick={() => setModalShow(true)}>Followers
                            </div>
                        </div>
                    ) : (
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gridTemplateRows: "1fr 1fr",
                            gap: "10px",
                            fontSize: "20px"
                        }}>
                            <div>{user.playlists_created.length}</div>
                            <div className="follower-btn">{user.followers.length}</div>
                            <div>Playlists</div>
                            <div className="follower-btn">Followers</div>
                        </div>
                    )}
                    <div style={{display: "flex", alignItems: "center", justifyContent: "left"}}>
                        {isOwner ? (
                            <button onClick={handleEditProfile} className="btn"
                                    style={{backgroundColor: "#ff70a6", color: "white"}}>Edit
                                Profile</button>
                        ) : (
                            !isFollowing ? (
                                <button className="btn" style={{backgroundColor: "#70d6ff", color: "white"}}
                                        onClick={handleFollow}>Follow</button>
                            ) : (
                                <button className="btn" onClick={handelUnfollow}
                                        style={{backgroundColor: "grey", color: "white"}}>Following</button>
                            )
                        )}
                    </div>
                    <div>
                        {
                            isOwner ? null : (
                                friend ? (<p>This user follows you</p>) : null
                            )
                        }
                    </div>
                </div>
                <div className="profile-desc" style={{fontSize: "20px"}}>
                    <p>{user.description}</p>
                </div>
            </div>
            <MyVerticallyCenteredModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                friends={friends}
            />
        </div>
    )
        ;
}
