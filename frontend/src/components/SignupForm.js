import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Validator} from "../utils/Validator.js";

import dataManager from "../utils/dataManager";

export function SignupForm() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate(); // Use navigate for redirection

    const handleChange = (e) => {
        const {name, value} = e.target;
        if (name === 'username') setUsername(value);
        if (name === 'email') setEmail(value);
        if (name === 'password') setPassword(value);
        if (name === 'confirmPassword') setConfirmPassword(value);
    };

    function getRandomProfilePicture() {
        const availableProfilePictures = [
            "https://octodex.github.com/images/vinyltocat.png",
            "https://ih1.redbubble.net/image.610287721.6095/st,small,507x507-pad,600x600,f8f8f8.u4.jpg",
            "https://rustacean.net/assets/rustacean-flat-gesture.png",
            "https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2F63aab9a7-3856-46dd-9a1a-97a3cfc2685b_1024x1024.png",
            "https://m.media-amazon.com/images/I/61X8OhzqytL.jpg"
        ];
        const randomIndex = Math.floor(Math.random() * availableProfilePictures.length);
        return availableProfilePictures[randomIndex];
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = Validator.validateSignup({username, email, password, confirmPassword});

        const profile_image_random = getRandomProfilePicture();

        if (Object.keys(validationErrors).length === 0) {
            const newUser = {
                username,
                email,
                password,
                profile_picture: profile_image_random,
                followers: [],
                following: [],
                playlists_created: [],
                playlists_saved: [],
                description: ""
            };

            try {
                const response = await fetch('http://localhost:3001/api/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newUser)
                });

                if (response.ok) {
                    sessionStorage.setItem('user', JSON.stringify(email));
                    sessionStorage.setItem('following', JSON.stringify([]));
                    console.log('User added successfully');
                    navigate("/home");
                } else {
                    const errorData = await response.json();
                    setErrors({email: errorData.message});
                }
            } catch (error) {
                setErrors({email: 'Error registering user'});
            }
        } else {
            setErrors(validationErrors);
        }
    };

    return (
        <div>
            <h3 className="form-heading">Join Now</h3>
            <form onSubmit={handleSubmit}>
                <div className={`input-group has-validation ${errors.username ? 'is-invalid' : ''}`}>
                    <div className="form-floating">
                        <input
                            type="text"
                            className="form-control"
                            id="floatingInputGroup1"
                            name="username"
                            placeholder="Username"
                            value={username}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="floatingInputGroup1">Username</label>
                    </div>
                    {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                </div>
                <div className={`input-group has-validation ${errors.email ? 'is-invalid' : ''}`}>
                    <div className="form-floating">
                        <input
                            type="email"
                            className="form-control"
                            id="floatingInputGroup2"
                            name="email"
                            placeholder="Email"
                            value={email}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="floatingInputGroup2">Email Address</label>
                    </div>
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                <div className={`input-group has-validation ${errors.password ? 'is-invalid' : ''}`}>
                    <div className="form-floating">
                        <input
                            type="password"
                            className="form-control"
                            id="floatingInputGroup3"
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="floatingInputGroup3">Password</label>
                    </div>
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>
                <div className={`input-group has-validation ${errors.confirmPassword ? 'is-invalid' : ''}`}>
                    <div className="form-floating">
                        <input
                            type="password"
                            className="form-control"
                            id="floatingInputGroup4"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="floatingInputGroup4">Confirm Password</label>
                    </div>
                    {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                </div>

                <button type="submit" className="form-floating btn btn-primary">Submit</button>
            </form>
        </div>
    );
}

