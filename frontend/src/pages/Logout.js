import React, {useEffect} from 'react'
import {useNavigate} from "react-router-dom";

export function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        sessionStorage.clear();
        navigate(`/`);
    }, []);

    return (
        <div>

        </div>
    );


}
