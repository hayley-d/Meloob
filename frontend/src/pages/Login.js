import React from 'react';
import {LoginForm} from '../components/LoginForm.js';
import {Link} from 'react-router-dom';


export class Login extends React.Component {

    render() {
        return (
            <div className="add-playlist-container">
                <Link to="/" className="back-btn">Back</Link>
                <div className="container-fluid defalut-container">
                    <LoginForm />
                </div>
            </div>
        );
    }
}
