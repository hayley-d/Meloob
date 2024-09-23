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

    /**
     * Converts a Spotify track URL to an embedded Spotify link.
     * @param {string} url - The original Spotify URL.
     * @returns {string} The converted embed link or the original URL if invalid.
     */
    const getSpotifyEmbedLink = (url) => {
        const spotifyTrackUrlPattern = /https:\/\/open\.spotify\.com\/track\/([a-zA-Z0-9]+)(\?.*)?/;
        const match = url.match(spotifyTrackUrlPattern);

        if (match) {
            const trackId = match[1];
            return `https://open.spotify.com/embed/track/${trackId}`;
        }
        return 'invalid';
    };

    const spotifyEmbedLink = getSpotifyEmbedLink(song.link);

    return (
        song.link === 'redacted' ?(
                <div className="song-card-dark">
                    <div className="song-card-header">
                        <h3 className="song-title-dark" title={song.title}>{song.title}</h3>
                    </div>
                    <div className="song-link">
                        <svg xmlns="http://www.w3.org/2000/svg"  width="50px" height="50px" fill="#8B0000FF" className="bi bi-ban" viewBox="0 0 16 16">
                            <path d="M15 8a6.97 6.97 0 0 0-1.71-4.584l-9.874 9.875A7 7 0 0 0 15 8M2.71 12.584l9.874-9.875a7 7 0 0 0-9.874 9.874ZM16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0"/>
                        </svg>
                    </div>
                    <div className="song-card-header">
                        <p className="song-card-footer-dark">{song.artist}</p>
                    </div>
                </div>
        ) : (
            <div className="song-card">
                <div className="song-card-header">
                        <div className="song-dots" title="Add song to playlist">
                            {!remove ? (
                                    <Link to={route}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" fill="#ff70a6"
                                             className="bi bi-three-dots" viewBox="0 0 16 16">
                                            <path
                                                d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
                                        </svg>
                                    </Link>) :
                                (
                                    <div onClick={removeMe} title="Remove" style={{cursor: 'pointer'}}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px"
                                             fill="#ff70a6" className="bi bi-three-dots" viewBox="0 0 16 16">
                                            <path
                                                d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
                                        </svg>
                                    </div>
                                )}
                        </div>
                        {/*<h3 className="song-title" title={song.title}>{song.title}</h3>*/}

                    </div>
                <div className="song-link">
                    {/*<a href={song.link} target="_blank" rel="noopener noreferrer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="50px" height="50px" fill="#70d6ff"
                                 className="bi bi-play-circle" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                <path
                                    d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445"/>
                            </svg>
                        </a>*/}
                    <iframe
                        src={spotifyEmbedLink}
                        width="100%"
                        height="100px"
                        frameBorder="0"
                        allow="encrypted-media"
                        title={song.title}
                    ></iframe>
                </div>
                {/*<div className="song-card-header">
                    <p className="song-card-footer">{song.artist}</p>
                </div>*/}
            </div>
        )
    );
}

