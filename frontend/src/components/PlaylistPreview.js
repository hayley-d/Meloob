import React, {useState} from 'react';
/**
 * PlaylistPreview Component
 *
 * A small playlist preview component used in a vertical list of playlists.
 * This component toggles between selected and unselected states when clicked.
 * If selected, it triggers an action to add the song to the playlist's song array.
 *
 * @component
 * @example
 * const playlist = {
 *   name: 'Chill Vibes',
 *   date_created: '2024-09-10',
 *   songs: []
 * }
 * const addSongToPlaylist = (playlist) => { console.log(playlist); }
 * return (
 *   <PlaylistPreview playlist={playlist} addSongToPlaylist={addSongToPlaylist} />
 * )
 *
 * @param {Object} props - The component's props.
 * @param {Object} props.playlist - The playlist object to display.
 * @param {string} props.playlist.name - The name of the playlist.
 * @param {string} props.playlist.date_created - The creation date of the playlist.
 * @param {function} props.addSongToPlaylist - Function to add a song to the playlist.
 * @returns {JSX.Element} A playlist preview component.
 */
export function PlaylistPreview({ playlist, handleSelect }) {
    const [selected, setSelected] = useState(false);

    /**
     * Toggles the selected state of the playlist.
     * Calls handleSelect to notify the parent.
     */
    const toggleSelected = () => {
        setSelected(!selected);
        handleSelect(playlist, !selected);
    }

    return (
        <div className="song-card shadow-lg p-3 mb-5 bg-body-tertiary rounded" style={{marginTop:"3vh",marginBottom:"3vh"}}>
            <div className="song-card-header" style={{textAlign: 'center'}}>
                <h3 className="song-title"
                    title={playlist.name}
                    style={{fontWeight: 'bold', fontSize: '20px'}}>{playlist.name}</h3>
            </div>
            <div className="song-link" onClick={toggleSelected}>
                {selected ? (<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#70d6ff"
                                  className="bi bi-check-circle-fill" viewBox="0 0 16 16">
                        <path
                            d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                    </svg>

                ) : (<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="black"
                          className="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                    <path
                        d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
                </svg>)}
            </div>
            <div className="song-card-header"><p style={{fontSize: "14px", color: "grey"}}>{playlist.date_created}</p>
            </div>
        </div>
    );
}


