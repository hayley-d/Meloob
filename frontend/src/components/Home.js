import React from "react";
import dataManager from "../utils/dataManager";
import {PlaylistContainerHorizontal} from "./PlaylistContainerHorizontal";
import {SongContainer} from "./SongContainer";
import {useNavigate} from "react-router-dom";
const navigate = useNavigate(); // Use navigate for redirection


export class Home extends React.Component{

    render() {
        const playlists = dataManager.getPlaylists();
        const songs = dataManager.getSongs();
        console.log(songs);
        return(
            <div>
                <PlaylistContainerHorizontal playlists={playlists}/>
                <SongContainer songs={songs}/>
            </div>
        );
    }

}

if(!sessionStorage.getItem('user')){
    navigate("/");
}