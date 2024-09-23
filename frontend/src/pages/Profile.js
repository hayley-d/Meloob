import React, {useEffect, useState} from 'react'
import dataManager from "../utils/dataManager";
import {useParams} from "react-router-dom";
import {ProfileView} from "../components/ProfileView";
import {PlaylistContainerHorizontal} from "../components/PlaylistContainerHorizontal";
import {NavBar} from "../components/NavBar";

export function Profile() {
    const {id} = useParams();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [createdPlaylists, setCreatedPlaylists] = useState([]);
    const [savedPlaylists, setSavedPlaylists] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [sessionUser, setSessionUser] = useState(false);
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const fetchedUser = await dataManager.getUser(id);
                await setUser(fetchedUser);
                const following = JSON.parse(sessionStorage.getItem('userData')).following.find(user => user === id);
                const owner = JSON.parse(sessionStorage.getItem('userData'))._id == id;
                await setIsOwner(true);
                if(following || owner){
                    await setIsFollowing(true);
                }
                if (fetchedUser) {
                    const {playlists_created, playlists_saved} = await fetchUserPlaylists(fetchedUser);
                    setCreatedPlaylists(playlists_created);
                    setSavedPlaylists(playlists_saved);
                }
            } catch (error) {
                console.error("Error fetching user or playlists:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    async function fetchUserPlaylists(user) {
        try {
            const playlists_created = await dataManager.getPlaylistsByIds(user.playlists_created);
            const playlists_saved = await dataManager.getPlaylistsByIds(user.playlists_saved);

            return {playlists_created, playlists_saved};
        } catch (error) {
            console.error('Error fetching playlists:', error);
            throw error;
        }
    }

    async function changeFollowing(isFollowing) {
        await setIsFollowing(isFollowing);
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

    if (!user) {
        return <div>User not found</div>;
    }

    return <div>
        <NavBar location="Profile"/>
        <ProfileView onFollow={changeFollowing}/>

        {
            isFollowing || isOwner ? (
                    <div>
                        {createdPlaylists.length > 0 && <div style={{width: "100vw", height: "fit-content", paddingLeft: "10vw"}}>
                            <h3 className="home-heading" style={{color: "#ff70a6"}}>Created</h3>
                            <hr/>
                        </div>}
                        {createdPlaylists.length > 0 && (
                            <PlaylistContainerHorizontal playlists={createdPlaylists}/>
                        )}
                        {savedPlaylists.length > 0 && <div style={{width: "100vw", height: "fit-content", paddingLeft: "10vw"}}>
                            <h3 className="home-heading" style={{color: "#70d6ff"}}>Saved</h3>
                            <hr/>
                        </div>}
                        {savedPlaylists.length > 0 && <PlaylistContainerHorizontal playlists={savedPlaylists}/>}
                    </div>
            ) : null
        }

    </div>


}
