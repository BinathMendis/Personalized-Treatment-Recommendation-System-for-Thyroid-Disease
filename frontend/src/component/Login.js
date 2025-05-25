import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import Swal from 'sweetalert2';
import "../style/Login.css";
import loginimg from '../assets/doc.png';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("patient_id", data.user.patientID);
        Swal.fire({
          title: 'Success!',
          text: 'You have successfully logged in.',
          icon: 'success',
          confirmButtonText: 'Go to Dashboard',
          confirmButtonColor: '#0b2fa5'
        }).then(() => {
          navigate("/dashboard");
        });
      } else {
        setError(data.error || "Login failed. Please try again.");
        Swal.fire({
          title: 'Error!',
          text: data.error || "Login failed. Please try again.",
          icon: 'error',
          confirmButtonText: 'Try Again',
          confirmButtonColor: '#0b2fa5'
        });
      }
    } catch (error) {
      setError("Error connecting to the server.");
      Swal.fire({
        title: 'Error!',
        text: "Error connecting to the server.",
        icon: 'error',
        confirmButtonText: 'Try Again',
        confirmButtonColor: '#0b2fa5'
      });
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-hero">
          <div className="hero-content">
            <img src={loginimg} alt="Medical illustration" className="hero-image" />
            <div className="hero-text">
              <h2>Advanced Patient Portal</h2>
              <p>Secure access to your medical records and healthcare services</p>
            </div>
          </div>
        </div>
        
        <div className="login-form-section">
          <div className="form-container">
            <div className="form-header">
              <Typography variant="h4" className="form-title">
                Sign In
              </Typography>
              <Typography variant="body1" className="form-subtitle" color="black">
                Access your account to continue
              </Typography>
            </div>

            {error && (
              <div className="error-message">
                <Typography color="error">{error}</Typography>
              </div>
            )}

            <form onSubmit={handleLogin} className="login-form">
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="form-actions">
                <Button
                  variant="contained"
                  type="submit"
                  fullWidth
                  size="large"
                  className="login-button"
                >
                  Login
                </Button>
              </div>
            </form>

            <div className="form-footer">
              <Typography variant="body2">
                <a href="/forgot-password" className="footer-link">Forgot password?</a>
              </Typography>
              <Typography variant="body2" className="footer-text">
                Don't have an account? <a href="/signup" className="footer-link">Sign up</a>
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;