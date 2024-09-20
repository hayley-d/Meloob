import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Validator } from "../utils/Validator.js";

import dataManager from "../utils/dataManager";

export function SignupForm() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate(); // Use navigate for redirection

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'username') setUsername(value);
        if (name === 'email') setEmail(value);
        if (name === 'password') setPassword(value);
        if (name === 'confirmPassword') setConfirmPassword(value);
    };

    /*const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form validation.....");
        const validationErrors = Validator.validateSignup({ username, email, password, confirmPassword });

        if (Object.keys(validationErrors).length === 0) {
            // Form is valid, proceed with form submission
            console.log('Form submitted successfully');
            try {
                // Add the user
                dataManager.addUser({ username, email, password })

                console.log('User added successfully');
                // Redirect to /home
                navigate("/home");
            } catch (error) {
                setErrors({ email: error.message });
            }
        } else {
            console.log("Signup form errors found!", validationErrors);
            setErrors(validationErrors);
        }
    };*/

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = Validator.validateSignup({ username, email, password, confirmPassword });

        if (Object.keys(validationErrors).length === 0) {
            const newUser = {
                username,
                email,
                password,
                profile_picture: "https://pbs.twimg.com/profile_images/1826287907264495616/IHoLcQnH_400x400.jpg",
                followers: [],
                following: [],
                playlists_created: [],
                playlists_saved: [],
                description:""
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
                    setErrors({ email: errorData.message });
                }
            } catch (error) {
                setErrors({ email: 'Error registering user' });
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

/*import React from "react";
import { Validator } from "../utils/Validator.js";
import userManager from "../utils/UserManager";
import {redirect} from "react-router-dom";
export class SignupForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            errors: {}
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange  (e)  {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit (e)  {
        e.preventDefault();
        console.log("Form validation.....");
        const { username, email, password, confirmPassword } = this.state;
        const errors = Validator.validateSignup({ username, email, password, confirmPassword });

        if (Object.keys(errors).length === 0) {
            // Form is valid, proceed with form submission
            console.log('Form submitted successfully');
            try {
                // Add the user to the UserManager
                userManager.addUser({ username, email, password });
                console.log('User added successfully');
                // Redirect or update state accordingly
                return redirect("/home");
            } catch (error) {
                this.setState({ errors: { email: error.message } });
            }
        } else {
            console.log("Signup form errors found!",errors);
            this.setState({ errors });
        }
    }

    render() {
        const { username, email, password, confirmPassword, errors } = this.state;
        return (
            <div>
                <h3 className="form-heading">Join Now</h3>
                <form onSubmit={this.handleSubmit}>
                    <div className={`input-group has-validation ${errors.username ? 'is-invalid' : ''}`}>
                        <div className="form-floating">
                            <input
                                type="text"
                                className="form-control"
                                id="floatingInputGroup1"
                                name="username"
                                placeholder="Username"
                                value={username}
                                onChange={this.handleChange}
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
                                onChange={this.handleChange}
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
                                onChange={this.handleChange}
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
                                onChange={this.handleChange}
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
}*/