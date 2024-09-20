import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import dataManager from '../utils/dataManager';
import {Validator} from "../utils/Validator";

export function EditProfileForm() {
    const { id } = useParams();
    const [formData, setFormData] = useState({ username: '', description: '', profile_picture: '' });
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [profileImageUrl, setProfileImageUrl] = useState('https://octodex.github.com/images/vinyltocat.png');
    const [selectedImageOption, setSelectedImageOption] = useState('1');  // Store the selected option

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await dataManager.getUser(id);
                setFormData({
                    username: user.username,
                    description: user.description,
                    profile_picture: user.profile_picture,
                });
            } catch (error) {
                console.error("Error fetching user:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleProfileImageChange = (e) => {
        const option = e.target.value;
        const profileImageUrl = getProfileImage(option);
        console.log("Image changed:", profileImageUrl);
        setFormData({ ...formData, profile_picture: profileImageUrl });
        setProfileImageUrl(profileImageUrl);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // Validate the form
        const validationErrors = Validator.validateProfileUpdate(formData);
        console.log(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {

            await dataManager.updateUserProfile(id, formData);
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
       else {
           return "https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2F63aab9a7-3856-46dd-9a1a-97a3cfc2685b_1024x1024.png";
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <h2>Edit Profile</h2>
            <form onSubmit={handleFormSubmit}>
                <div className="form-profile-image" style={{backgroundImage:`url(${profileImageUrl})`}}>

                </div>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input type="text" className="form-control" id="username"
                           value={formData.username} onChange={handleInputChange} name="username"/>
                    {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea className="form-control" id="description" name="description" rows="3"
                              value={formData.description}
                              onChange={handleInputChange}></textarea>
                    {errors.description && <p style={{ color: 'red' }}>{errors.description}</p>}
                </div>
                <div>
                    <label htmlFor="profile-image" className="form-label">Profile Picture</label>
                    <select className="form-select" aria-label="Default select example"
                            id="profile-picture"
                            name="profile_picture"
                            value={selectedImageOption}
                            onChange={handleProfileImageChange}>
                        <option value="1">Octocat</option>
                        <option value="2">Gopher</option>
                        <option value="3">Crab</option>
                        <option value="4">Croc</option>
                    </select>
                    {errors.profile_picture && <p style={{ color: 'red' }}>{errors.profile_picture}</p>}
                </div>


                <button type="submit" className="btn">Save Changes</button>
            </form>
        </div>
    );
}
