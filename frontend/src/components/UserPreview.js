import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

export function UserPreview({user}) {
    const navigate = useNavigate();

    const goToUserProfile = () => {
        navigate(`/profile/${user._id}`);
    }

    useEffect(() => {
        //console.log(user)
    },[])

    return (

        <div className="user-preview-card">
            <div className="user-preview-header">
                <h3 onClick={goToUserProfile} className="user-preview-username" title={user.username}>{user.username}</h3>
            </div>
            <div className="user-preview-image-container" onClick={goToUserProfile}>
                <div className="user-preview-image" style={{backgroundImage:`url(${user.profile_picture})`}}></div>
            </div>
        </div>
    );
}

