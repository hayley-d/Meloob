import React, {Component, createRef} from 'react';
import {Scrollbar} from 'react-scrollbars-custom';
import {Comment} from "./Comment";
import {Song} from "./Song";

/**
* SongContainerVertical Component
*
* A container component that displays a list of songs associated with a playlist.
* The songs are shown in a scrollable view.
*
* @component
* @example
* const songs = [
        *   { title: 'Song 1', artist: 'Artist 1', link: 'https://spotify.com/song1' },
    *   { title: 'Song 2', artist: 'Artist 2', link: 'https://spotify.com/song2' },
* ];
* return (
    *   <SongContainerVertical songs={songs} />
    * )
*
* @param {Object} props - The component's props.
* @param {Array} props.songs - The list of songs to display.
* @param {string} props.songs[].title - The title of the song.
* @param {string} props.songs[].artist - The name of the song artist.
* @param {string} props.songs[].link - The Spotify link to the song.
* @returns {JSX.Element} A container displaying a list of songs.
*/
export class SongContainerVetical extends Component {

    constructor(props) {
        super(props);
        this.songs = this.props.songs;
    }

    render() {
        if (!Array.isArray(this.songs)) {
            return <div>Error: Songs data is not an array.</div>;
        }

        return (
            <div className="container-fluid"
                 style={{display: "flex",flexDirection:"column", gap: "30px", justifyContent: "center", alignItems: "center"}}>
                <Scrollbar style={{width: "40vw", height: "80vh", gap: "50px"}}>
                    {this.songs.map((song, index) => (
                        <div key={index} style={{marginTop:"30px",marginBottom:"30px"}}>
                            <Song
                                song={song}
                            />
                        </div>
                    ))}
                </Scrollbar>
            </div>
        );
    }
}


