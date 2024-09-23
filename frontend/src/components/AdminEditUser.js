import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dataManager from '../utils/dataManager';

export function AdminEditUser({id}) {
    const [formData, setFormData] = useState({ username: '',email:'', description: '', profile_picture: 'https://octodex.github.com/images/vinyltocat.png' });
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [profileImageUrl, setProfileImageUrl] = useState('https://octodex.github.com/images/vinyltocat.png');
    const [selectedImageOption, setSelectedImageOption] = useState('1');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await dataManager.getUser(id);
                setFormData({
                    username: user.username,
                    email: user.email,
                    description: user.description,
                    profile_picture: user.profile_picture,
                });
                const option = getProfileImageOption(user.profile_picture);
                setSelectedImageOption(option);
                setProfileImageUrl(user.profile_picture);
            } catch (error) {
                console.error("Error fetching user:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    const getProfileImageOption = (profilePicture) => {
        if (profilePicture === "https://octodex.github.com/images/vinyltocat.png") return '1';
        if (profilePicture === "https://ih1.redbubble.net/image.610287721.6095/st,small,507x507-pad,600x600,f8f8f8.u4.jpg") return '2';
        if (profilePicture === "https://rustacean.net/assets/rustacean-flat-gesture.png") return '3';
        if (profilePicture === "https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2F63aab9a7-3856-46dd-9a1a-97a3cfc2685b_1024x1024.png") return '4';
        return '5';
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleProfileImageChange = (e) => {
        const option = e.target.value;
        const profileImageUrl = getProfileImage(option);
        setFormData({ ...formData, profile_picture: profileImageUrl });
        setProfileImageUrl(profileImageUrl);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            await dataManager.updateUserProfileAdmin(id, formData);
            navigate(`/profile/${id}`);
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    const getProfileImage = (option)  => {
        setSelectedImageOption(option);
        if(option == 1){
            return "https://octodex.github.com/images/vinyltocat.png";
        }
        else if (option == 2){
            return "https://ih1.redbubble.net/image.610287721.6095/st,small,507x507-pad,600x600,f8f8f8.u4.jpg";
        }
        else if(option == 3){
            return "https://rustacean.net/assets/rustacean-flat-gesture.png";
        }
        else if(option == 4){
            return "https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2F63aab9a7-3856-46dd-9a1a-97a3cfc2685b_1024x1024.png";
        }
        else {
            return "https://m.media-amazon.com/images/I/61X8OhzqytL.jpg";
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <h2 className="form-heading">Edit Profile</h2>
            <form onSubmit={handleFormSubmit}>
                <div className="image-container">
                    <div className="form-profile-image" style={{backgroundImage: `url(${profileImageUrl})`}}>
                    </div>
                </div>
                <div className="input-group">
                    <label htmlFor="username" className="label">Username</label>
                    <input type="text" className="input" id="username" value={formData.username}
                           onChange={handleInputChange} name="username"/>
                </div>
                <div className="input-group">
                    <label htmlFor="email" className="label">Email</label>
                    <input type="text" className="input" id="email" value={formData.email}
                           onChange={handleInputChange} name="email"/>
                </div>
                <div className="input-group">
                    <label htmlFor="description" className="label">Description</label>
                    <textarea className="textarea" id="description" name="description" rows="3"
                              value={formData.description} onChange={handleInputChange}></textarea>
                </div>
                <div className="input-group">
                    <label htmlFor="profile-image" className="label">Profile Picture</label>
                    <select className="select" id="profile-picture" name="profile_picture" value={selectedImageOption}
                            onChange={handleProfileImageChange}>
                        <option value="1">Octocat</option>
                        <option value="2">Gopher</option>
                        <option value="3">Crab</option>
                        <option value="4">Croc</option>
                        <option value="5">Unicorn</option>
                    </select>
                </div>

                <div className="button-container">
                    <button type="submit" className="button">Save Changes</button>
                </div>

            </form>
        </div>
    );
}
