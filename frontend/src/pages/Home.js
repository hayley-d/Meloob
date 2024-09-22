import React from "react"
import {NavBar} from '../components/NavBar.js';
import dataManager from "../utils/dataManager";
import {PlaylistContainerHorizontal} from "../components/PlaylistContainerHorizontal";
import {SongContainer} from "../components/SongContainer";
import {Link} from "react-router-dom";
import {Footer} from "../components/Footer";

export class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playlists: [],
            songs: [],
            isLoading: true,
            error: null
        };
        this.fetchPlaylists = this.fetchPlaylists.bind(this);
        this.fetchSongs = this.fetchSongs.bind(this);
    }

    async componentDidMount() {
        await this.fetchPlaylists();
        await this.fetchSongs();
    }

    async fetchPlaylists() {
        try {
            const user = JSON.parse(sessionStorage.getItem("userData"));
            const playlists = await dataManager.fetchPlaylistsByUserIds(user.following);
            playlists.sort((a, b) => {
                const [dayA, monthA, yearA] = a.date_created.split('/');
                const [dayB, monthB, yearB] = b.date_created.split('/');
                const dateA = new Date(`20${yearA}-${monthA}-${dayA}`);
                const dateB = new Date(`20${yearB}-${monthB}-${dayB}`);
                return dateB - dateA;
            });
            this.setState({
                playlists: playlists,
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
        const {playlists, songs, isLoading, error} = this.state;

        if (isLoading) {
            return (
                <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )
        }

        if (error) {
            return <div>Error: {error}</div>;
        }

        return (
            <div>
                <NavBar location="home"/>
                <div className="other-container">
                    <h3 className="home-heading">Activity</h3>
                    <hr/>
                </div>
                <PlaylistContainerHorizontal playlists={playlists}/>
                <div className="other-container">
                    <h3 className="home-heading" style={{color: "#ff9770"}}>Discover</h3>
                    <hr/>
                </div>
                <SongContainer songs={songs}/>

                <Footer/>
            </div>
        );
    }
}




