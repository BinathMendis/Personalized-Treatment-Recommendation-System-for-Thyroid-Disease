import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Typography, CircularProgress } from "@mui/material";
import Swal from 'sweetalert2'; // Import SweetAlert2
import "../style/Signup.css";  // Import your existing Signup CSS for background consistency

const VerifyOTP = () => {
    const [otp, setOtp] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);  // Open the dialog when the component loads
    const [countdown, setCountdown] = useState(60);  // Initialize countdown to 60 seconds
    const [resendDisabled, setResendDisabled] = useState(true); // Disable resend button initially

    const navigate = useNavigate();

    // Retrieve user data from localStorage
    const signupData = JSON.parse(localStorage.getItem("signupData"));
    const { email, username, password } = signupData || {};

    useEffect(() => {
        // If there's no signup data in localStorage, redirect to signup page
        if (!signupData) {
            navigate("/signup");
        }

        // Start countdown timer
        const timer = countdown > 0 && setInterval(() => {
            setCountdown(prevCountdown => prevCountdown - 1);
        }, 1000);

        // Clear timer when countdown reaches 0
        if (countdown === 0) {
            setResendDisabled(false);  // Enable resend button
        }

        // Cleanup interval on component unmount or when countdown reaches 0
        return () => clearInterval(timer);

    }, [signupData, countdown, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await axios.post("http://127.0.0.1:5000/auth/verify-otp", {
                email,
                otp,
                username,
                password,
            });
            setMessage(response.data.message);

            if (response.status === 201) {
                localStorage.removeItem("signupData");
                // Show success SweetAlert and redirect to login
                Swal.fire({
                    title: 'OTP Verified!',
                    text: 'You have successfully verified your OTP.',
                    icon: 'success',
                    confirmButtonText: 'Proceed to Login'
                }).then(() => {
                    navigate("/login");
                });
            }
        } catch (error) {
            setMessage(error.response?.data?.error || "OTP verification failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleClosePopup = () => {
        setOpen(false);  // Close the dialog when cancel button is clicked
        
        // Show SweetAlert for confirmation
        Swal.fire({
            title: 'Are you sure?',
            text: 'If you cancel, your signup process will be aborted.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Cancel',
            cancelButtonText: 'No, Go Back',
        }).then((result) => {
            if (result.isConfirmed) {
                // User confirmed, navigate to signup page
                localStorage.removeItem("signupData");  // Optional: Clean up localStorage
                navigate("/signup");
            } else {
                // User did not confirm, reopen the dialog
                setOpen(true);
            }
        });
    };

    const handleResendOTP = async () => {
        if (resendDisabled) return;

        setResendDisabled(true); // Disable resend button
        setCountdown(60); // Reset the countdown

        try {
            const response = await axios.post("http://127.0.0.1:5000/auth/resend-otp", {
                email,
            });

            if (response.status === 200) {
                Swal.fire({
                    title: 'OTP Resent!',
                    text: 'A new OTP has been sent to your email.',
                    icon: 'success',
                    confirmButtonText: 'Okay'
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'There was an error sending the OTP.',
                icon: 'error',
                confirmButtonText: 'Try Again'
            });
        }
    };

    return (
        <div className="signup-container">  {/* Use the same class for the container */}
            <Dialog open={open} onClose={handleClosePopup} maxWidth="sm" fullWidth>
                <DialogTitle>Verify OTP</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" gutterBottom>
                        Please enter the OTP sent to your email:
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="OTP"
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            fullWidth
                            margin="normal"
                            inputProps={{ maxLength: 6 }}
                        />
                        {message && <Typography color="error" variant="body2">{message}</Typography>}
                        <DialogActions>
                            <Button onClick={handleClosePopup} color="secondary"> 
                                Cancel 
                            </Button>
                            <Button
                                type="submit"
                                color="primary"
                                variant="contained"
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : "Verify"}
                            </Button>
                        </DialogActions>
                    </form>

                    {/* Resend OTP section */}
                    <div className="resend-otp">
                        <Typography variant="body2" color="textSecondary" align="center">
                            {countdown > 0 ? `You can resend OTP in ${countdown} seconds.` : "You can now resend the OTP."}
                        </Typography>
                        <Button
                            onClick={handleResendOTP}
                            color="primary"
                            disabled={resendDisabled}
                            fullWidth
                        >
                            Resend OTP
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default VerifyOTP;
