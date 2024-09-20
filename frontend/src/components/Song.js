import React from 'react';
import dataManager from "../utils/dataManager";
import {Link, useNavigate, useParams} from 'react-router-dom';
/**
 * A React component that represents a song card with various functionalities
 * like viewing and removing the song from a playlist.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {Object} props.song - The song object that contains information about the song.
 * @param {string} props.song.id - The unique ID of the song.
 * @param {string} props.song.title - The title of the song.
 * @param {string} props.song.link - The URL to the song.
 * @param {string} props.song.artist - The artist of the song.
 * @param {boolean} props.remove - A flag to determine if the song can be removed from the playlist.
 * @returns {JSX.Element} The rendered song card component.
 *
 * @example
 * const song = {
 *    id: "song1",
 *    title: "Song Title",
 *    link: "https://example.com",
 *    artist: "Artist Name"
 * };
 * <Song song={song} remove={true} />
 */
export function Song({song,remove,playlist,onRemove}) {
    const route = `/addSong/${song.id}`;
    remove = remove===true ? true:false;

    /**
     * Removes a song from the playlist by calling the API.
     * This function is a placeholder for further implementation.
     *
     * @function removeSong
     */
    async function removeSong() {
        try {
            const updatedPlaylist = await dataManager.removeSongFromPlaylist(playlist, song.id);
            console.log('Updated playlist:', updatedPlaylist);
        } catch (error) {
            console.error('Error removing song:', error);
        }
    }        

    async function removeMe() {
      onRemove(song.id);
    }
    

    return (
        <div className="song-card shadow-lg p-3 mb-5 bg-body-tertiary rounded">
            <div className="song-card-header" style={{textAlign: 'center'}}>
                <h3 className="song-title"
                    title={song.title}
                    style={{fontWeight: 'bold', fontSize: '20px'}}>{song.title}</h3>
                <div title="Add song to playlist">
                    {!remove ? (
                    <Link to={route}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#ff70a6"
                             className="bi bi-three-dots" viewBox="0 0 16 16">
                            <path
                                d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
                        </svg>
                    </Link>) : 
                    (
                      <div onClick={removeMe} title="Remove" style={{ cursor: 'pointer' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#ff70a6"
                             className="bi bi-three-dots" viewBox="0 0 16 16">
                            <path
                                d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
                        </svg>
                      </div>
                      )}
                </div>
            </div>
            <div className="song-link">
                <a href={song.link} target="_blank" rel="noopener noreferrer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="50px" height="50px" fill="#70d6ff"
                         className="bi bi-play-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                        <path
                            d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445"/>
                    </svg>
                </a>
            </div>
            <div className="song-card-header"><p style={{fontSize: "14px", color: "grey"}}>{song.artist}</p></div>


        </div>
    );
}

