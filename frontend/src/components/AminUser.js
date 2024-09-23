import React, { useState, useEffect } from "react";

export function AminUser({user,onDelete,onEdit}) {
    const [edit, setEdit] = useState(false);
    useEffect(() => {
        setEdit(false);
    }, []);

    const handelDelete = () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (confirmDelete) {
            onDelete(user._id);
        }
    };

    const toggleEdit = () => {
        setEdit(prevState => !prevState);
        onEdit(user._id);
    }

    return (
        <div className="admin-user-grid">
            <div>
                <h5>{user.username}</h5>
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
