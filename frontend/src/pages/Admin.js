import React, { useState, useEffect } from "react";
import dataManager from "../utils/dataManager";
import { Scrollbar } from 'react-scrollbars-custom';
import {AminUser} from "../components/AminUser";
import {AdminSong} from "../components/AdminSong";
import {AdminPlaylist} from "../components/AdminPlaylist";
import {NavBar} from "../components/NavBar";

export function Admin() {
    const [users, setUsers] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [filteredPlaylists, setFilteredPlaylists] = useState([]);
    const [filteredSongs, setFilteredSongs] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersData = await dataManager.getUsers();
                const playlistsData = await dataManager.getPlaylists();
                const songsData = await dataManager.getSongs();

                setUsers(usersData);
                setPlaylists(playlistsData);
                setSongs(songsData);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch data");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        /*const filteredUsers = users.filter(user =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase())
        );*/

        setFilteredUsers(users)

        /*const filteredPlaylists = playlists.filter(playlist =>
            playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
        );*/
        setFilteredPlaylists(playlists);
        /*const filteredSongs = songs.filter(song =>
            song.title.toLowerCase().includes(searchTerm.toLowerCase())
        );*/
        setFilteredSongs(songs)
    }, [users,playlists,songs]);

    const handleDeleteUser = async (userId) => {
        try {
            await dataManager.deleteUser(userId);
            setUsers(users.filter((user) => user._id !== userId));
        } catch (err) {
            setError("Failed to delete user");
        }
    };



    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <NavBar location="admin"/>
            <div className="admin-default-container">
                <div className="admin-container">
                    <div className="admin-heading-container">
                        <h1 className="form-heading">Admin Panel</h1>
                    </div>

                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="option-group">
                        <div>
                            <h3>Users</h3>
                            <Scrollbar style={{width: "100%", height: "200px"}}>
                                {filteredUsers.map((user, index) => (
                                    <AminUser user={user} key={index}/>
                                ))}
                            </Scrollbar>
                        </div>

                        <div>
                            <h3>Playlists</h3>
                            <Scrollbar style={{width: "100%", height: "200px"}}>
                                {filteredPlaylists.map((playlist, index) => (
                                    <AdminPlaylist playlist={playlist} key={index}/>
                                ))}
                            </Scrollbar>
                        </div>

                        <div>
                            <h3 className="admin-heading">Songs</h3>
                            <Scrollbar style={{width: "100%", height: "200px"}}>
                                {filteredSongs.map((song, index) => (
                                    <AdminSong song={song} key={index}/>
                                ))}
                            </Scrollbar>
                        </div>

                    </div>
                    <div className="button-grid">
                        <div>
                            <button className="button-red">Delete All Users</button>
                        </div>
                        <div>
                            <button className="button-red">Delete All Playlists</button>
                        </div>
                        <div>
                            <button className="button-red">Delete All Songs</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}
