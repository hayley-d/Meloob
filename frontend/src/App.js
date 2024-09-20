import React from "react"
import {Splash} from "./pages/Splash.js";
import {Home} from "./pages/Home.js";
import {Browse} from "./pages/Browse.js";
import {Profile} from "./pages/Profile.js";
import {Playlist} from "./pages/Playlist.js";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {NavBar} from "./components/NavBar.js";
import {Login} from "./pages/Login.js";
import {EditProfile} from "./pages/EditProfile";
import {AddSong} from "./pages/AddSong";
import {EditPlaylist} from "./pages/EditPlaylist";
import {AddPlaylist} from "./pages/AddPlaylist";
import {AddSongToPlaylist} from "./pages/AddSongToPlaylist";

const router = createBrowserRouter(
            
    [
        {path:'/', element: <Splash/>},
        {path:'/home', element: <Home />},
        {path:'/browse', element: <Browse />},
        {path:'/login',element:<Login/>},
        {path:'/profile/:id',element:<Profile/>},
        {path:'/playlist/:id',element:<Playlist/>},
        {path:'/edit-profile/:id',element:<EditProfile/>},
        {path:'/edit-playlist/:id',element:<EditPlaylist/>},
        {path:'/addSong/:songId',element:<AddSongToPlaylist/>},
        {path:'/add/playlist',element:<AddPlaylist/>},
        {path:'/add/song',element:<AddSong/>},

    ]
);


export class App extends React.Component{

    render(){
        return(
            <RouterProvider router={router}>
                <NavBar />
            </RouterProvider>
        );
    }
}

