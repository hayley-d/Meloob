import React, { useState, useEffect } from "react";
import dataManager from "../utils/dataManager";
import { Scrollbar } from 'react-scrollbars-custom';
import {AminUser} from "../components/AminUser";
import {AdminSong} from "../components/AdminSong";
import {AdminPlaylist} from "../components/AdminPlaylist";
import {NavBar} from "../components/NavBar";
import Fuse from "fuse.js";
import {AdminEditUser} from "../components/AdminEditUser";
import {AdminEditSong} from "../components/AdminEditSong";
import {AdminEditPlaylist} from "../components/AdminEditPlaylist";

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

    const [editUser, setEditUser] = useState(false);
    const [editPlaylist, setEditPlaylist] = useState(false);
    const [editSong, setEditSong] = useState(false);

    const [editUserId, setEditUserId] = useState('');
    const [editPlaylistId, setEditPlaylistId] = useState('');
    const [editSongId, setEditSongId] = useState({});


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
        setFilteredUsers(users)
        setFilteredPlaylists(playlists);
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

    const handleFuzzySearch = (term) => {
        if(term!==''){
            const playlistOptions = {
                keys: ['name', 'hashtags', 'genre'],
                threshold: 0.4,
            };
            const songOptions = {
                keys: ['title'],
                threshold: 0.4,
            };
            const userOptions = {
                keys: ['username'],
                threshold: 0.4,
            };

            const playlistFuse = new Fuse(playlists, playlistOptions);
            const songFuse = new Fuse(songs, songOptions);
            const userFuse = new Fuse(users, userOptions);

            const filteredPlaylists = playlistFuse.search(term).map(result => result.item);
            const filteredSongs = songFuse.search(term).map(result => result.item);
            const filteredUsers = userFuse.search(term).map(result => result.item);

            setFilteredPlaylists(filteredPlaylists);
            setFilteredSongs(filteredSongs);
            setFilteredUsers(filteredUsers);

        } else{
            setFilteredUsers(users)
            setFilteredPlaylists(playlists);
            setFilteredSongs(songs);
        }

    };

    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        handleFuzzySearch(term);
    };

    const cancelSearch = () => {
        setSearchTerm('');
        setFilteredPlaylists(playlists);
        setFilteredSongs(songs);
        setFilteredUsers(users);
    };

    const deleteUser = async (userId) => {
        try {
            await dataManager.deleteUser(userId);
            setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
        } catch (error) {
            setError('Failed to delete user');
        }
    };

    const deletePlaylist = async (playlistId) => {
        try {
            await dataManager.deletePlaylist(playlistId);
            setPlaylists((prevPlaylists) => prevPlaylists.filter((playlist) => playlist._id !== playlistId));
        } catch (error) {
            setError('Failed to delete playlist');
        }
    };

    const deleteSong = async (songId) => {
        try {
            await dataManager.deleteSong(songId);
            setSongs((prevSongs) => prevSongs.filter((song) => song.id !== songId));
        } catch (error) {
            setError('Failed to delete song');
        }
    };

    const handelEditUser = async (userId) => {
        setEditUserId(userId);
        setEditUser(prevState => !prevState);
    };

    const handelEditPlaylist = async (playlistId) => {
        setEditPlaylistId(playlistId);
        setEditPlaylist(prevState => !prevState);
    };

    const handelEditSong = async (song) => {
        setEditSongId(song);
        setEditSong(prevState => !prevState);
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

                    <div className="admin-search-container">
                        <input type="text" className="input"  value={searchTerm} onChange={handleSearchChange}/>
                        <button className="admin-button" onClick={handleFuzzySearch}>Search</button>
                        <button className="admin-button" onClick={cancelSearch}>X</button>
                    </div>

                    <div className="option-group">
                    <div>
                            <h3>Users</h3>
                            <Scrollbar style={{width: "100%", height: "200px"}}>
                                {filteredUsers.map((user, index) => (
                                    <AminUser user={user} onDelete={deleteUser} onEdit={handelEditUser} key={index}/>
                                ))}
                            </Scrollbar>
                        </div>

                        <div>
                            <h3>Playlists</h3>
                            <Scrollbar style={{width: "100%", height: "200px"}}>
                                {filteredPlaylists.map((playlist, index) => (
                                    <AdminPlaylist playlist={playlist} onDelete={deletePlaylist} onEdit={handelEditPlaylist}  key={index}/>
                                ))}
                            </Scrollbar>
                        </div>

                        <div>
                            <h3 className="admin-heading">Songs</h3>
                            <Scrollbar style={{width: "100%", height: "200px"}}>
                                {filteredSongs.map((song, index) => (
                                    <AdminSong song={song} onDelete={deleteSong} onEdit={handelEditSong}  key={index}/>
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
            {editUser ? (
                <AdminEditUser id={editUserId}/>
            ) : null}
            {editPlaylist ? (
                <AdminEditPlaylist id={editPlaylistId}/>
            ) : null}
            {editSong ? (
                <AdminEditSong song={editSongId}/>
            ) : null}
        </div>

    );
}
