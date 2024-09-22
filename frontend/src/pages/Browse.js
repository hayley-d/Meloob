/*
import React from 'react';
import dataManager from "../utils/dataManager";
import {NavBar} from "../components/NavBar";
import {PlaylistContainerHorizontal} from "../components/PlaylistContainerHorizontal";
import {SongContainer} from "../components/SongContainer";
import {SearchBar} from "../components/SearchBar";
import {useLocation, useNavigate} from 'react-router-dom';


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
        this.handleQueryParameters = this.handleQueryParameters.bind(this);
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
        console.log(this.props);
        await this.fetchPlaylists();
        await this.fetchSongs();
        this.handleQueryParameters();
    }

    handleQueryParameters() {
        const { search } = this.props.location;
        const params = new URLSearchParams(search);
        const searchTerm = params.get('search');

        if (searchTerm) {
            this.handleFuzzySearch(searchTerm.replace('#', ''));
        }
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
*/
import React, { useEffect, useState } from 'react';
import dataManager from "../utils/dataManager";
import { NavBar } from "../components/NavBar";
import { PlaylistContainerHorizontal } from "../components/PlaylistContainerHorizontal";
import { SongContainer } from "../components/SongContainer";
import { SearchBar } from "../components/SearchBar";
import { useSearchParams } from 'react-router-dom';

export function Browse() {
    const [playlists, setPlaylists] = useState([]);
    const [songs, setSongs] = useState([]);
    const [filteredPlaylists, setFilteredPlaylists] = useState([]);
    const [filteredSongs, setFilteredSongs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchParams] = useSearchParams();

    useEffect( () => {
        const fetchData = async () => {
            try {
                const playlistsData = await dataManager.getPlaylists();
                const songsData = await dataManager.getSongs();
                setPlaylists(playlistsData);
                setSongs(songsData);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to load data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (playlists.length > 0 && songs.length > 0) {
            const term = searchParams.get('search') || '';
            if (term) {
                setSearchTerm(term);
                handleFuzzySearch(term);
            } else {
                setFilteredPlaylists(playlistsData);
                setFilteredSongs(songsData);
            }
        }
    }, [playlists, songs]);



    const handleFuzzySearch = (term) => {
        console.log(term);
        console.log(playlists)
        const filteredPlaylists = playlists.filter(playlist => {
            const nameMatch = playlist.name.toLowerCase().includes(term.toLowerCase());
            const hashtagsMatch = playlist.hashtags.some(hashtag =>
                hashtag.toLowerCase().includes(term.toLowerCase())
            );
            const matchGenre = playlist.genre.toLowerCase().includes(term.toLowerCase());
            return nameMatch || hashtagsMatch || matchGenre;
        });

        const filteredSongs = songs.filter(song =>
            song.title.toLowerCase().includes(term.toLowerCase())
        );

        setFilteredPlaylists(filteredPlaylists);
        setFilteredSongs(filteredSongs);
    };

    const cancelSearch = () => {
        setSearchTerm('');
        setFilteredPlaylists(playlists);
        setFilteredSongs(songs);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <NavBar location="Browse" />
            <SearchBar onSearch={handleFuzzySearch} onCancel={cancelSearch} />
            {filteredPlaylists.length > 0 && (
                <div>
                    <div style={{ width: "100vw", height: "fit-content", paddingLeft: "10vw" }}>
                        <h3 className="home-heading">Playlists</h3>
                        <hr />
                    </div>
                    <PlaylistContainerHorizontal playlists={filteredPlaylists} />
                </div>
            )}
            {filteredSongs.length > 0 && (
                <div>
                    <div style={{ width: "100vw", height: "fit-content", paddingLeft: "10vw" }}>
                        <h3 className="home-heading" style={{ color: "#ff9770" }}>Songs</h3>
                        <hr />
                    </div>
                    <SongContainer songs={filteredSongs} />
                </div>
            )}
        </div>
    );
}

