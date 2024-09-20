import React, {useEffect, useState} from 'react'
import dataManager from "../utils/dataManager";
import {useParams} from "react-router-dom";
import {NavBar} from "../components/NavBar";
import {PlaylistPreviewFull} from "../components/PlaylistPreviewFull";
import {SongContainerVetical} from "../components/SongContainerVetical";

export function Playlist() {
    const {id} = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [playlist,setPlaylist] = useState({});
    const [sessionUser,setSessionUser] = useState({});
    const [songs,setSongs] = useState([]);
    const [remove,setRemove] = useState(false);

    useEffect(() => {
        setSessionUser(sessionStorage.getItem('userData') ? JSON.parse(sessionStorage.getItem('userData')) : '');
        console.log();
        const fetchPlaylist = async () => {
            setIsLoading(true);

            try {
                const playlist = await dataManager.getPlaylistByID(id);
                setPlaylist(playlist);
                console.log(JSON.parse(sessionStorage.getItem('userData')).email,playlist.user.email);
                const rem = JSON.parse(sessionStorage.getItem('userData')).email === playlist.user.email ? true:false;
                console.log(rem);
                setRemove(rem);

                if (playlist && Array.isArray(playlist.songs)) {
                    const fetchedSongs = await fetchSongs(playlist.songs);
                    setSongs(fetchedSongs);
                } else {
                    setSongs([]);
                }
            } catch (error) {
                console.error("Error fetching playlist:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlaylist();
    }, [id]);

    async function fetchSongs(songIds) {
        try {
            if (Array.isArray(songIds) && songIds.length > 0) {
                const songs = await dataManager.getSongsByIds(songIds);
                return songs;
            } else {
                return [];
            }
        } catch (error) {
            console.error('Error fetching songs:', error);
            throw error;
        }
    }

    /**
     * Removes a song from the playlist by calling the API.
     * This function is a placeholder for further implementation.
     *
     * @function removeSong
     */
    async function removeSong(songId) {
        console.log(songId,"Being removed");
        try {
            const updatedPlaylist = await dataManager.removeSongFromPlaylist(id, songId);
            setPlaylist(updatedPlaylist);
            if (updatedPlaylist && Array.isArray(updatedPlaylist.songs)) {
                    const fetchedSongs = await fetchSongs(updatedPlaylist.songs);
                    setSongs(fetchedSongs);
                } else {
                    setSongs([]);
                }
        } catch (error) {
            console.error('Error removing song:', error);
        }
    }

    if (isLoading) {
        return (
            <div>
                <NavBar location="playlist"/>
                <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <NavBar location="playlist"/>
            <div style={{
                display: "flex",
                gap: "50px",
                paddingLeft: "30vw",
                paddingRight: "30vw",
                paddingTop:"10vh",
                alignItems: "center",

            }}>
                <PlaylistPreviewFull playlist={playlist}/>
                <SongContainerVetical songs={songs} remove={remove} playlist={id} onRemove={removeSong}/>
            </div>
        </div>


    );


}
