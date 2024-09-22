import React, {Component, createRef} from 'react';
import {Song} from './Song';
import { Scrollbar } from 'react-scrollbars-custom';


export class SongContainer extends Component {

    constructor(props) {
        super(props);
        this.songs = this.props.songs;
        this.containerRef = createRef();
        this.state = {
            scrollPosition: 0,
        };
        this.handleScroll = this.handleScroll.bind(this);
    }

    handleScroll (scrollAmount) {
        if (this.containerRef.current) {
            this.containerRef.current.scrollBy({
                left: scrollAmount,
                behavior: "smooth",
            });

            this.setState({
                scrollPosition: this.containerRef.current.scrollLeft + scrollAmount,
            });
        }
    };

    render() {
        return (
            <div className="container-fluid" style={{display:"flex",flexDirection:"column",gap:"30px",justifyContent:"center", alignItems:"center"}}>
                <div className="scroll-container">
                    <Scrollbar style={{width: " 80vw", height: "23vh"}}>
                        <div
                            ref={this.containerRef}
                            style={{
                                width: "80vw",
                                height: "23vh",
                            }}>

                            <div className="content-box">
                                {this.props.songs.map((song, index) => (
                                    <Song key={index} song={song}/>
                                ))}
                            </div>

                        </div>
                    </Scrollbar>;
                </div>
            </div>


        );
    }
}



