import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TextField, Button, Typography, Paper, Link } from "@mui/material";
import Swal from 'sweetalert2'; // Import SweetAlert2
import "../style/Signup.css"; // Import CSS file
import Signupimg from "../assets/signup2.jpg"; // Import image file

const Signup = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            Swal.fire({
                title: 'Error',
                text: 'Passwords do not match',
                icon: 'error',
                confirmButtonText: 'Try Again'
            });
            return;
        }
        setError("");

        // Show loading OTP alert
        const loadingAlert = Swal.fire({
            title: 'Sending OTP...',
            text: 'Please wait while we send the OTP to your email.',
            icon: 'info',
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading(); // Show loading spinner
            }
        });

        try {
            const response = await axios.post("http://127.0.0.1:5000/auth/signup", {
                username: formData.username,
                email: formData.email,
                password: formData.password,
            });

            if (response.status === 200) {
                setMessage(response.data.message);
                // Save user data for OTP verification
                localStorage.setItem("signupData", JSON.stringify({
                    email: formData.email,
                    username: formData.username,
                    password: formData.password
                }));

                // Update the loading alert to success message and navigate after confirmation
                loadingAlert.close(); // Close the loading alert
                Swal.fire({
                    title: 'Success!',
                    text: response.data.message,
                    icon: 'success',
                    confirmButtonText: 'Proceed'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Navigate to OTP verification page after confirmation
                        navigate("/verify-otp");
                    }
                });
            }
        } catch (error) {
            setMessage(error.response?.data?.error || "Signup failed.");
            // Close loading alert and show error message
            loadingAlert.close();
            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.error || "Signup failed.",
                icon: 'error',
                confirmButtonText: 'Try Again'
            });
        }
    };

    return (
        <div className="signup-container">
            <Paper className="signup-paper">
                {/* Left Side - Image */}
                <div className="signup-image">
                    <img
                        src={Signupimg}
                        alt="Signup"
                    />
                </div>

                {/* Right Side - Signup Form */}
                <div className="signup-form">
                    <Typography variant="h4">Create an Account</Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Username"
                            name="username"
                            variant="outlined"
                            margin="normal"
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            variant="outlined"
                            margin="normal"
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            onChange={handleChange}
                            required
                        />
                        {error && <Typography color="error">{error}</Typography>}
                        {message && <Typography color="success">{message}</Typography>}
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className="signup-button"
                        >
                            Sign Up
                        </Button>
                    </form>
                    <div className="signin-link">
                        <Typography variant="body2" align="center">
                            Already have an account?{" "}
                            <Link href="/login" variant="body2" style={{ textDecoration: 'none', fontWeight: 'bold' }}>
                                Sign In
                            </Link>
                        </Typography>
                    </div>
                </div>
            </Paper>
        </div>
    );
};

export default Signup;
