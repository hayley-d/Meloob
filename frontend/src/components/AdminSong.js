import React, { useState, useEffect } from "react";
import dataManager from "../utils/dataManager";

export function AdminSong({song,onDelete,onEdit}) {
    const [edit, setEdit] = useState(false);
    useEffect(() => {

    }, []);

    const handelDelete = () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this song?");
        if (confirmDelete) {
            onDelete(song.id);
        }
    };

    const toggleEdit = () => {
        setEdit(prevState => !prevState);
        onEdit(song);
    }

    return (
        <div className="admin-user-grid">
            <div>
                <h5>{song.title}</h5>
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
