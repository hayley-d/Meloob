import React from 'react';
import {NavBar} from '../components/NavBar.js';
import {SignupForm} from '../components/SignupForm.js';


export class Splash extends React.Component {

    render() {
        return (
            <div>
                <NavBar location="splash"/>
                <div id="splash" className=" splash container-fluid"></div>
                <div className="container text-center">
                    <div className="row">
                        <div className="col">
                            <h3 className="about-heading">About</h3>
                            <p className="about-text">
                                Welcome to Meloob, where we rewind to a time when music was actually good. Our mission
                                is to rpovide our users with ad-free music from the golden era of tunes. At Meloov we
                                believe that if music was good enough for your grandparents, it's good enough for you.
                                So join today, create a retro playlist and enjoy the simpler times when records were
                                spinning not buffering.
                            </p>
                        </div>
                        <div className="col">

                        </div>
                        <div className="col">
                            <SignupForm/>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}
