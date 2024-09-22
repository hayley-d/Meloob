import React, {Component, createRef} from 'react';
import {PlaylistPreviewLarge} from './PlaylistPreviewLarge';
import { Scrollbar } from 'react-scrollbars-custom';


export class PlaylistContainerHorizontal extends Component {

    constructor(props) {
        super(props);
        this.playlists = this.props.playlists;
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
        if (!Array.isArray(this.playlists)) {
            return <div>Error: Playlists data is not an array.</div>;
        }

        return (
            <div className="horizontal-outer-container container-fluid">
                <div className="scroll-container">
                    <Scrollbar style={{width: " 80vw", height: "80vh"}}>
                        <div ref={this.containerRef} className="horizontal-mid-container">
                            <div className="content-box-horizontal-playlists">
                                {this.props.playlists.map((playlist, index) => (
                                    <PlaylistPreviewLarge key={index} playlist={playlist}/>
                                ))}
                            </div>
                        </div>
                    </Scrollbar>
                </div>
            </div>
        );
    }
}



