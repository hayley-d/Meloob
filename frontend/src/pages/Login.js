import React from 'react';
import {LoginForm} from '../components/LoginForm.js';
import {Link} from 'react-router-dom';


export class Login extends React.Component {

    render() {
        return (
            <div style={{padding:'1rem'}}>
                <Link to="/" className="back-btn">Back</Link>
                <div className="container-fluid" style={{display: 'flex', justifyContent: 'center',alignItems: 'center'}}>
                    <LoginForm />
                </div>
            </div>
        );
    }
}
