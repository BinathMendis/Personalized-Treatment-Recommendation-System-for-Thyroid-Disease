import React from "react";
import { Box, Typography, IconButton, Link as MuiLink } from "@mui/material";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import logoPath from "../assets/LOGO.png";

const Footer = () => {
  const patientID = localStorage.getItem("patient_id");

  const handleLogout = () => {
    localStorage.removeItem("patient_id");
    window.location.href = "/login";
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#0b2fa5",
        color: "white",
        textAlign: "center",
        py: 2,
        mt: 4,
        position: "relative",
        bottom: 0,
        width: "100%",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
        <img src={logoPath} alt="Logo" style={{ height: "40px" }} />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mb: 1 }}>
        <IconButton component={Link} to="/" sx={{ color: "white" }}>
          <HomeIcon />
        </IconButton>

        {patientID ? (
          <>
            <IconButton component={Link} to="/track-health" sx={{ color: "white" }}>
              <TrackChangesIcon />
            </IconButton>
            <IconButton component={Link} to="/clinical-advice" sx={{ color: "white" }}>
              <HelpOutlineIcon />
            </IconButton>
            <IconButton component={Link} to="/profile" sx={{ color: "white" }}>
              <AccountCircleIcon />
            </IconButton>
            <IconButton onClick={handleLogout} sx={{ color: "white" }}>
              <LogoutIcon />
            </IconButton>
          </>
        ) : (
          <>
            <IconButton component={Link} to="/login" sx={{ color: "white" }}>
              <LoginIcon />
            </IconButton>
          </>
        )}
      </Box>

      <Typography variant="body2">
        &copy; {new Date().getFullYear()} ThyroPulse. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
