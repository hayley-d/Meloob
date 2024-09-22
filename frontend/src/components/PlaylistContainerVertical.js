import React, {Component, createRef} from 'react';
import {PlaylistPreview} from './PlaylistPreview';
import {Scrollbar} from 'react-scrollbars-custom';
import dataManager from "../utils/dataManager";

/**
 * PlaylistContainerVertical Component
 *
 * A container that displays PlaylistPreview components vertically.
 * The user can select playlists, and clicking "Add Song" adds a song to the selected playlists.
 *
 * @component
 * @example
 * const playlists = [{name: "Chill Vibes", date_created: "2024-09-10", songs: []}, {name: "Workout Hits", date_created: "2024-09-01", songs: []}]
 * return (
 *   <PlaylistContainerVertical playlists={playlists} />
 * )
 *
 * @param {Object} props - The component's props.
 * @param {Array} props.playlists - An array of playlist objects to display.
 * @param {string} props.playlists[].name - The name of each playlist.
 * @param {string} props.playlists[].date_created - The date the playlist was created.
 * @param {Array} props.playlists[].songs - The array of songs in each playlist.
 * @returns {JSX.Element} A vertically scrollable container of playlist previews.
 */
 export class PlaylistContainerVertical extends Component {

    constructor(props) {
        super(props);
        this.playlists = this.props.playlists;
        this.songId = this.props.songId;
        this.state = {
            selectedPlaylists: []
        };
    }

    /**
     * Toggles playlist selection.
     * @param {Object} playlist - The playlist to toggle.
     * @param {boolean} isSelected - Whether the playlist is selected.
     */
    handleSelectPlaylist = (playlist, isSelected) => {
        this.setState((prevState) => {
            const selectedPlaylists = isSelected
                ? [...prevState.selectedPlaylists, playlist]
                : prevState.selectedPlaylists.filter(p => p.id !== playlist.id);
            return { selectedPlaylists };
        });
    }

    /**
     * Adds a song to the selected playlists.
     */
    handleAddSong = async () => {
        try {
            const updatePromises = this.state.selectedPlaylists.map(async (playlist) => {
                playlist.songs.push(this.songId);
                return dataManager.updatePlaylistSongs(playlist.id, playlist.songs);
            });

            const updatedPlaylists = await Promise.all(updatePromises);

            window.location.href = '/home';
        } catch (error) {
            console.error('Failed to update playlists:', error);
        }
    }

    createNewPlaylist = async () => {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        const currentDate =  `${day}/${month}/${year}`;
        const formData = {
            userId: JSON.parse(sessionStorage.getItem('userData'))._id,
            coverImage: 'https://opensource.com/sites/default/files/lead-images/rust_programming_crab_sea.png',
            date_created:currentDate,
            genre: '66e377a9b13b146f637c19e8',
            name: 'new Playlist',
            description: 'newly created Playlist',
            hashtags: [],
            songs:[`${this.songId}`]
        }
        try {
            const response = await dataManager.addPlaylist(formData.userId,formData);
            window.location.href = '/home';
        } catch (error) {
            console.error("Error adding playlist:", error);
        }
    }

    render() {

        if (!Array.isArray(this.props.playlists)) {
            return <div>Error: Playlists data is not an array.</div>;
        }

        return (
            <div className="playlist-container-vertical container-fluid">
                <Scrollbar style={{width: "25vw", height: "40vh", gap: "50px"}}>
                    {this.props.playlists.map((playlist, index) => (
                        <PlaylistPreview key={index} playlist={playlist} handleSelect={this.handleSelectPlaylist}/>
                    ))}
                </Scrollbar>
                <div className="playlist-vertical-button-container">
                    <button onClick={this.handleAddSong} className="button">Add Song</button>
                    <button onClick={this.createNewPlaylist} className="button">Create new Playlist</button>
                </div>

            </div>
        );
    }
}



