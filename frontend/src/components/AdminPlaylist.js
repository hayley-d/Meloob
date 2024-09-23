import React, { useState, useEffect } from "react";

export function AdminPlaylist({playlist,onDelete,onEdit}) {
    const [edit, setEdit] = useState(false);
    useEffect(() => {

    }, []);

    const handelDelete = () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this playlist?");
        if (confirmDelete) {
            onDelete(playlist.id);
        }
    };

    const toggleEdit = () => {
        setEdit(prevState => !prevState);
        onEdit(playlist.id);
    }

    return (
        <div className="admin-user-grid">
            <div>
                <h5>{playlist.name}</h5>
            </div>
            <div>
                <button className="admin-button" onClick={handelDelete}>Delete</button>
            </div>
            <div>
                {edit ? (<button className="button-red" onClick={toggleEdit}>Cancel Edit</button>) : (<button className="admin-button" onClick={toggleEdit}>Edit</button>)}
            </div>
        </div>
    );
}
