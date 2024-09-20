import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Validator } from "../utils/Validator.js";
import dataManager from "../utils/dataManager";

export function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate(); // Use navigate for redirection

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'email') setEmail(value);
        if (name === 'password') setPassword(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form validation.....");
        const validationErrors = Validator.validateLogin({ email, password });

        if (Object.keys(validationErrors).length === 0) {
            console.log('Form submitted successfully');

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
                    sessionStorage.setItem('user', JSON.stringify(email));
                    sessionStorage.setItem('userData', JSON.stringify(user));
                    //console.log('Stored user:', JSON.parse(sessionStorage.getItem('userData')));
                    console.log('Login successful');
                    navigate("/home"); // Redirect to /home
                } else {
                    const errorData = await response.json();
                    setErrors({ email: errorData.message });
                }
            } catch (error) {
                setErrors({ email: 'Error logging in' });
            }
        } else {
            console.log("login form errors found!", validationErrors);
            setErrors(validationErrors);
        }
    };

    return (
        <div style={{ width: '50%' }}>
            <h3 className="form-heading">Login</h3>
            <form onSubmit={handleSubmit}>
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
                <button type="submit" className="form-floating btn btn-primary">Submit</button>
            </form>
        </div>
    );
}

/*import React from 'react';
import { Validator } from "../utils/Validator.js";
import UserManager from "../utils/UserManager";
import { redirect } from "react-router-dom";

export class LoginForm extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
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
        const { email, password } = this.state;
        const errors = Validator.validateLogin({ email, password });

        if (Object.keys(errors).length === 0) {
            console.log('Form submitted successfully');
            const user = UserManager.getUserByEmail(email);
            if (user) {
                console.log('User found:', user);
                //redirect
                return redirect("/home");
            } else {
                this.setState({ errors: { email: 'User not found' } });
            }
        } else {
            console.log("login form errors found!",errors);
            this.setState({ errors });
        }
    }

      render(){
          const { email, password, errors } = this.state;
          return(
              <div style={{ width: '50%'}}>
                  <h3 className="form-heading">Login</h3>
                  <form onSubmit={this.handleSubmit}>
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


                      <button type="submit" className="form-floating btn btn-primary">Submit</button>
                  </form>
              </div>
          );
      }
}*/
