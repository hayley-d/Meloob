import React from 'react';
import {Link} from 'react-router-dom';
import {EditProfileForm} from "../components/EditProfileForm";


export class EditProfile extends React.Component {

    render() {
        const userId = JSON.parse(sessionStorage.getItem('userData'))._id;
        const route = `/profile/${userId}`
        return (
            <div className="add-playlist-container">
                <Link to={route} className="back-btn">Back</Link>
                <div className="container-fluid defalut-container" >
                    <EditProfileForm />
                </div>
            </div>
        );
    }
}
