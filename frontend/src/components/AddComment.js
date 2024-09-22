import React, {useState} from 'react';


export function AddComment({onComment}) {
    const [content, setContent] = useState('')

    const handleAddComment = async () => {
        if (content !== '') {
            const commentData = {
                content: content,
                userId: JSON.parse(sessionStorage.getItem("userData"))._id,
            };
            //console.log(commentData)

            try {
                await onComment(commentData);
                setContent('');
            } catch (error) {
                console.error('Error:', error.message);

            }
        }
    };


    return (
        <div style={{
            width: '100%',
            height: 'fit-content',
            marginTop: "20px",
            marginBottom: "20px",
            display: "flex",
            gap: "10px",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column"
        }}>
            <div style={{width: '80%', height: 'fit-content'}}>
                <textarea className="form-control" id="comment" rows="3" style={{color: "#28282f"}} value={content}
                          onChange={(e) => setContent(e.target.value)}></textarea>
            </div>
            <button className="btn" style={{
                borderRadius: "10px",
                backgroundColor: "#ff9770",
                color: "white",
                fontSize: "18px",
                padding: "10px"
            }} onClick={handleAddComment}>Post
            </button>
        </div>
    );
}


