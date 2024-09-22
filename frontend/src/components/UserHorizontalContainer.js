import React, {Component, createRef} from 'react';
import { Scrollbar } from 'react-scrollbars-custom';
import {UserPreview} from "./UserPreview";


export class UserHorizontalContainer extends Component {

    constructor(props) {
        super(props);
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
            <div className="container-fluid song-container-outer">
                <div className="scroll-container">
                    <Scrollbar style={{width: " 80vw", height: "23vh"}}>
                        <div ref={this.containerRef} className="song-container-mid">

                            <div className="content-box">
                                {this.props.users.map((user, index) => (
                                    <UserPreview key={index} user={user}/>
                                ))}
                            </div>

                        </div>
                    </Scrollbar>;
                </div>
            </div>


        );
    }
}



