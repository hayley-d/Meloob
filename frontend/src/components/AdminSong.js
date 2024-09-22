import React, { useState, useEffect } from "react";
import dataManager from "../utils/dataManager";

export function AdminSong({song}) {

    useEffect(() => {

    }, []);

    return (
        <div className="admin-user-grid">
            <div>
                <h5>{song.title}</h5>
            </div>
            <div>
                <button className="admin-button">Delete</button>
            </div>
            <div>
                <button className="admin-button">Edit</button>
            </div>
        </div>
    );
}
