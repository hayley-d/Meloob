import React, {useState} from 'react';
import '../../public/assets/css/FormStyles.css';

export function AddComment({onComment}) {
    const [content, setContent] = useState('')

    const handleAddComment = async () => {
        if (content !== '') {
            const commentData = {
                content: content,
                userId: JSON.parse(sessionStorage.getItem("userData"))._id,
            };

            try {
                await onComment(commentData);
                setContent('');
            } catch (error) {
                console.error('Error:', error.message);

            }
        }
    };


    return (
        <div className="add-comment-container">
            <div className="textarea-container">
                <textarea className="textarea" id="comment" rows="3" value={content} onChange={(e) => setContent(e.target.value)}></textarea>
            </div>
            <button className="button"  onClick={handleAddComment}>Post</button>
        </div>
    );
}


