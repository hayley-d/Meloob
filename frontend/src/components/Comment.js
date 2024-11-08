import React, {useState} from 'react';
import {Link} from "react-router-dom";

/**
 * Comment Component
 *
 * A comment playlist preview component used in a vertical list of comments.
 * This component is displayed in a container for its associated playlist.
 *
 * @component
 * @example
 * const comment = {
 *   userId: '12345',
 *   playlistId: '0121441',
 *   date: '10/09/2024',
 *   content: 'Hello World!',
 *   user: { username: 'Chill Vibes' }
 * }
 */
export function Comment({comment}) {
    const route = `/profile/${comment.userId}`;

    if (!comment || !comment.user) {
        return <div></div>;
    }

    return (
        <div className="comment-card">
            <div className="comment-header">
                <div>
                    <Link to={route} className="comment-username-link">
                        <h3 className="comment-username" title={comment.user.username}>{comment.user.username}</h3>
                    </Link>
                </div>
                <div>
                    <p className="comment-date">{comment.date}</p>
                </div>
            </div>
            <div className="comment-content">
                {comment.content}
            </div>
        </div>
    )
}


