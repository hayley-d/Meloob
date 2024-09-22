import React from 'react';
import dataManager from "../utils/dataManager";
import {NavBar} from "../components/NavBar";
import {PlaylistContainerHorizontal} from "../components/PlaylistContainerHorizontal";
import {SongContainer} from "../components/SongContainer";
import {SearchBar} from "../components/SearchBar";
import Fuse from 'fuse.js';

export class Browse extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playlists: [],
            songs: [],
            filteredPlaylists: [],
            filteredSongs: [],
            isLoading: true,
            error: null,
            searchTerm: ''
        };
        this.fetchPlaylists = this.fetchPlaylists.bind(this);
        this.fetchSongs = this.fetchSongs.bind(this);
        this.handleFuzzySearch = this.handleFuzzySearch.bind(this);
        this.cancelSearch = this.cancelSearch.bind(this);
    }

    handleFuzzySearch(term) {
        const {playlists, songs} = this.state;

        const filteredPlaylists = playlists.filter(playlist => {
            const nameMatch = playlist.name.toLowerCase().includes(term.toLowerCase());
            const hashtagsMatch = playlist.hashtags.some(hashtag =>
                hashtag.toLowerCase().includes(term.toLowerCase())
            );
            const genreMatch = playlist.genre.toLowerCase().includes(term.toLowerCase());
            return nameMatch || hashtagsMatch || genreMatch;
        });


        const filteredSongs = songs.filter(song =>
            song.title.toLowerCase().includes(term.toLowerCase())
        );

        this.setState({
            searchTerm: term,
            filteredPlaylists,
            filteredSongs
        });
    };

    cancelSearch() {
        this.setState({
            searchTerm: '',
            filteredPlaylists: this.state.playlists,
            filteredSongs: this.state.songs
        });
    }


    async componentDidMount() {
        await this.fetchPlaylists();
        await this.fetchSongs();
    }

    async fetchPlaylists() {
        try {
            const playlists = await dataManager.getPlaylists();
            this.setState({
                playlists: playlists,
                filteredPlaylists: playlists
            });
        } catch (error) {
            console.error("Error fetching data:", error);
            this.setState({
                isLoading: false,
                error: "Failed to load data."
            });
        }
    }

    async fetchSongs() {
        try {
            const songs = await dataManager.getSongs();
            this.setState({
                songs: songs,
                filteredSongs: songs,
                isLoading: false
            });
        } catch (error) {
            console.error("Error fetching data:", error);
            this.setState({
                isLoading: false,
                error: "Failed to load data."
            });
        }
    }


    render() {
        const {isLoading, error} = this.state;

        if (isLoading) {
            return <div>Loading...</div>;
        }

        if (error) {
            return <div>Error: {error}</div>;
        }

        return (
            <div>
                <NavBar location="Browse"/>
                <SearchBar onSearch={this.handleFuzzySearch} onCancel={this.cancelSearch}/>
                {
                    this.state.filteredPlaylists.length > 0 ? (
                        <div>
                            <div style={{width: "100vw", height: "fit-content", paddingLeft: "10vw"}}>
                                <h3 className="home-heading">Playlists</h3>
                                <hr/>
                            </div>
                            <PlaylistContainerHorizontal playlists={this.state.filteredPlaylists}/>
                        </div>
                    ) : null
                }

                {
                    this.state.filteredSongs.length > 0 ? (
                        <div>
                            <div style={{width: "100vw", height: "fit-content", paddingLeft: "10vw"}}>
                                <h3 className="home-heading" style={{color: "#ff9770"}}>Songs</h3>
                                <hr/>
                            </div>
                            <SongContainer songs={this.state.filteredSongs}/>
                        </div>
                    ) : null
                }

            </div>
        );
    }
}
