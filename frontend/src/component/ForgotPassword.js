import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://127.0.0.1:5000/auth/forgot-password", { email });
            setMessage(response.data.message);
            if (response.status === 200) {
                navigate("/reset-password", { state: { email } });
            }
        } catch (error) {
            setMessage(error.response?.data?.error || "Error sending OTP.");
        }
    };

    return (
        <div>
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <button type="submit">Send OTP</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ForgotPassword;
