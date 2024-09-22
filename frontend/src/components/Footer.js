import React from 'react'
import { Link } from 'react-router-dom';

export class Footer extends React.Component{
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <div className="footer-container">
                <div className="footer-sub-container">
                    <Link to='/add/playlist' className="footer-link">Add Playlist</Link>
                </div>
                <div className="footer-sub-container2">
                    <Link to='/add/song' className="footer-link">Add Song</Link>
                </div>
            </div>
        );
    }
}



