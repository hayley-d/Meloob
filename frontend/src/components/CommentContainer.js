import React, {Component, createRef} from 'react';
import {Scrollbar} from 'react-scrollbars-custom';
import {Comment} from "./Comment";

/**
 * CommentContainer Component
 *
 * A container component that displays a list of comments associated with a playlist.
 * The comments are shown in a scrollable view.
 *
 * @component
 * @example
 * const comments = [
 *   { user: { username: 'User1' }, content: 'This is a comment', date: '2024-09-10' },
 *   { user: { username: 'User2' }, content: 'Another comment', date: '2024-09-09' }
 * ]
 * return (
 *   <CommentContainer comments={comments} />
 * )
 *
 * @param {Object} props - The component's props.
 * @param {Array} props.comments - The list of comments to display.
 * @param {Object} props.comments[].user - The user who posted the comment.
 * @param {string} props.comments[].user.username - The username of the comment author.
 * @param {string} props.comments[].content - The text content of the comment.
 * @param {string} props.comments[].date - The date the comment was posted.
 * @returns {JSX.Element} A container displaying a list of comments.
 */
export class CommentContainer extends Component {

    constructor(props) {
        super(props);
        this.comments = this.props.comments;
    }

    render() {
        if (!Array.isArray(this.comments)) {
            return <div>Error: Playlists data is not an array.</div>;
        }

        return (
            <div className="container-fluid"
                 style={{display: "flex",flexDirection:"column", gap: "30px", justifyContent: "center", alignItems: "center"}}>
                <Scrollbar style={{width: "40vw", height: "40vh", gap: "50px"}}>
                    {this.comments.map((comment, index) => (
                        <Comment
                            key={index}
                            comment={comment}
                        />
                    ))}
                </Scrollbar>
            </div>
        );
    }
}



