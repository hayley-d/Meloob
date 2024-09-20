import React from 'react';
import {Link} from 'react-router-dom';
import {EditProfileForm} from "../components/EditProfileForm";


export class EditProfile extends React.Component {

    render() {
        const userId = JSON.parse(sessionStorage.getItem('userData'))._id;
        const route = `/profile/${userId}`
        return (
            <div style={{padding:'1rem'}}>
                <Link to={route} className="back-btn">Back</Link>
                <div className="container-fluid" style={{display: 'flex', justifyContent: 'center',alignItems: 'center'}}>
                    <EditProfileForm />
                </div>
            </div>
        );
    }
}
