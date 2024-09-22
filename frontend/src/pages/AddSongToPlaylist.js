import React, {useEffect, useState} from "react"
import dataManager from "../utils/dataManager";
import {Link, useParams} from "react-router-dom";
import {PlaylistPreview} from "../components/PlaylistPreview";
import {PlaylistContainerVertical} from "../components/PlaylistContainerVertical";
/**
 * AddSongToPlaylist Component
 *
 * This component handles the logic for adding a song to selected playlists.
 *
 * @component
 * @example
 * const selectedPlaylists = [{name: "Chill Vibes", songs: []}]
 * const handleAddSong = () => {}
 * return (
 *   <AddSong selectedPlaylists={selectedPlaylists} handleAddSong={handleAddSong} />
 * )
 *
 * @param {Array} props.selectedPlaylists - The playlists selected by the user.
 * @param {Function} props.handleAddSong - Function to handle adding a song to the selected playlists.
 * @returns {JSX.Element} A button that triggers adding a song.
 */
export function AddSongToPlaylist() {
    const {songId} = useParams();
    const [playlists, setPlaylists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const fetchedUser = await dataManager.getUser(JSON.parse(sessionStorage.getItem('userData'))._id);

                if (fetchedUser) {
                    const {playlists_created} = await fetchUserPlaylists(fetchedUser);
                    setPlaylists(playlists_created);
                }
            } catch (error) {
                console.error("Error fetching user or playlists:", error);
            } finally {
                setIsLoading(false); // Ensure loading state is updated
            }
        };
        fetchUser();
    }, []);

    async function fetchUserPlaylists(user) {
        try {
            const playlists_created = await dataManager.getPlaylistsByIds(user.playlists_created);

            playlists_created.map(p => p.user = user);

            return {playlists_created};
        } catch (error) {
            console.error('Error fetching playlists:', error);
            throw error;
        }
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{padding:'1rem', display: 'flex', justifyContent: 'center',flexDirection:"column",gap:"50px"}}>
            <div style={{width:"10vw"}}>
                <Link to='/home' className="back-btn">Back</Link>
            </div>

            <div style={{width: "100vw", height: "fit-content", paddingLeft: "10vw"}}>
                <h3 className="home-heading" style={{fontSize:"30px",color:"white"}}>Select Playlists To Add Song:</h3>
            </div>
            {playlists.length > 0 && (
                <PlaylistContainerVertical playlists={playlists} songId={songId}/>
            )}
        </div>
    );

}