import React, {Component, createRef} from 'react';
import {PlaylistPreviewLarge} from './PlaylistPreviewLarge';
import { Scrollbar } from 'react-scrollbars-custom';


export class PlaylistContainerHorizontal extends Component {

    constructor(props) {
        super(props);
        this.playlists = this.props.playlists;
        //console.log("Playlists", this.props.playlists);
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

            // Update the scroll position state
            this.setState({
                scrollPosition: this.containerRef.current.scrollLeft + scrollAmount,
            });
        }
    };

    render() {
        //console.log(this.playlists);

        if (!Array.isArray(this.playlists)) {
            return <div>Error: Playlists data is not an array.</div>;
        }

        return (
            <div className="container-fluid" style={{display:"flex",flexDirection:"column",gap:"30px",justifyContent:"center", alignItems:"center"}}>
                <div className="scroll-container">
                    <Scrollbar style={{width: " 80vw", height: "80vh"}}>
                        <div
                            ref={this.containerRef}
                            style={{
                                width: "80vw",
                                height: "80vh",

                            }}>

                            <div className="content-box" style={{height:"fit-content"}}>
                                {this.props.playlists.map((playlist, index) => (
                                    <PlaylistPreviewLarge key={index} playlist={playlist}/>
                                ))}
                            </div>

                        </div>
                    </Scrollbar>;
                </div>
            </div>


        );
    }
}



