import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            localStorage.removeItem("patient_id");
            await axios.post("http://127.0.0.1:5000/auth/logout");
            navigate("/login");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <div>
            <h2>Logout</h2>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Logout;
