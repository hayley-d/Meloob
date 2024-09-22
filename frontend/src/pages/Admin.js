import React, { useState, useEffect } from "react";
import dataManager from "../utils/dataManager";

export function Admin() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await dataManager.getAllUsers(); // Assuming getAllUsers fetches user data
                setUsers(data);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch users");
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleDeleteUser = async (userId) => {
        try {
            await dataManager.deleteUser(userId);
            setUsers(users.filter((user) => user._id !== userId));
        } catch (err) {
            setError("Failed to delete user");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="admin-container">
            <h1>Admin Panel</h1>
            <table className="admin-table">
                <thead>
                <tr>
                    <th>User ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.length > 0 ? (
                    users.map((user) => (
                        <tr key={user._id}>
                            <td>{user._id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>
                                <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="4">No users found</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}
