import React from 'react'
import { Link } from 'react-router-dom';

export class Footer extends React.Component{
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "40px",
            }}>
                <div style={{
                    backgroundColor: "#70d6ff",
                    borderRadius: "10px",
                    padding: "10px",
                    textAlign: "center",
                    cursor: "pointer"
                }}>
                    <Link to='/add/playlist' style={{color: "white", textDecoration: "none", fontSize: "16px"}}>
                        Add Playlist</Link>
                </div>
                <div style={{
                    backgroundColor: "#ff70a6",
                    borderRadius: "10px",
                    padding: "10px",
                    textAlign: "center",
                    cursor: "pointer"
                }}>
                    <Link to='/add/song' style={{color: "white", textDecoration: "none", fontSize: "16px"}}>Add
                        Song</Link>
                </div>


            </div>
        );
    }
}



