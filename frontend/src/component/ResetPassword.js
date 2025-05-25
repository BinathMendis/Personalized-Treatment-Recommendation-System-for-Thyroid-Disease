import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/reset-password", {
                email,
                otp,
                password,
            });
            setMessage(response.data.message);
            if (response.status === 200) {
                navigate("/login");
            }
        } catch (error) {
            setMessage(error.response?.data?.error || "Password reset failed.");
        }
    };

    return (
        <div>
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                <input type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Reset Password</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ResetPassword;
