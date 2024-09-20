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
            // Create an array of promises to update each playlist
            const updatePromises = this.state.selectedPlaylists.map(async (playlist) => {
                playlist.songs.push(this.songId); // Add the song to the playlist's songs array
                console.log(`Adding song to playlist: ${playlist.name}`, playlist.songs);
                // Update the playlist with the new songs array
                return dataManager.updatePlaylistSongs(playlist.id, playlist.songs);
            });

            // Wait for all update promises to resolve
            const updatedPlaylists = await Promise.all(updatePromises);

            console.log('All playlists updated:', updatedPlaylists);

            window.location.href = '/home';
        } catch (error) {
            console.error('Failed to update playlists:', error);
        }
    }




    render() {
        // Ensure that the provided playlists prop is an array
        if (!Array.isArray(this.playlists)) {
            return <div>Error: Playlists data is not an array.</div>;
        }

        return (
            <div className="container-fluid"
                 style={{display: "flex",flexDirection:"column", gap: "30px", justifyContent: "center", alignItems: "center"}}>
                <Scrollbar style={{width: "25vw", height: "40vh", gap: "50px"}}>
                    {this.playlists.map((playlist, index) => (
                        <PlaylistPreview
                            key={index}
                            playlist={playlist}
                            handleSelect={this.handleSelectPlaylist}
                        />
                    ))}
                </Scrollbar>
                <button onClick={this.handleAddSong} className="btn back-btn" style={{backgroundColor:"#ff70a6",color:"white"}}>
                    Add Song
                </button>
            </div>
        );
    }
}



