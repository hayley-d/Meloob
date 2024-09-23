import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Validator } from "../utils/Validator.js";
import '../../public/assets/css/FormStyles.css';


export function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'email') setEmail(value);
        if (name === 'password') setPassword(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = Validator.validateLogin({ email, password });

        if (Object.keys(validationErrors).length === 0) {
            try {
                const response = await fetch('http://localhost:3001/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                if (response.ok) {
                    const data = await response.json();
                    const user = data.user;

                    const adminResponse = await fetch(`http://localhost:3001/api/admins/${user.id}`);
                    const isAdmin = await adminResponse.json()

                    sessionStorage.setItem('user', JSON.stringify(email));
                    sessionStorage.setItem('userData', JSON.stringify(user));
                    sessionStorage.setItem('isAdmin', JSON.stringify(isAdmin.isAdmin));
                    navigate("/home");
                } else {
                    const errorData = await response.json();
                    setErrors({ email: errorData.message });
                }
            } catch (error) {
                setErrors({ email: 'Error logging in' });
            }
        } else {
            setErrors(validationErrors);
        }
    };

    return (
        <div className="login-form-container">
            <h3 className="form-heading" >Login</h3>
            <form onSubmit={handleSubmit}>
                <div className={`input-group ${errors.email ? 'input-error' : ''}`}>
                    <label className="label" htmlFor="email">Email Address</label>
                    <input type="email" id="email" name="email" className="input" placeholder="Email" value={email} onChange={handleChange} required/>
                    {errors.email && <div className="error-message">{errors.email}</div>}
                </div>
                <div className={`input-group ${errors.password ? 'input-error' : ''}`}>
                    <label className="label" htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" className="input" placeholder="Password" value={password} onChange={handleChange} required/>
                    {errors.password && <div className="error-message">{errors.password}</div>}
                </div>
                <div className="button-container">
                    <button type="submit" className="button">Submit</button>
                </div>

            </form>
        </div>
    );
}

