import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import PregnantWomanIcon from "@mui/icons-material/PregnantWoman";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LoginIcon from "@mui/icons-material/Login";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import LogoutIcon from "@mui/icons-material/Logout";
import "../style/Navbar.css";
import logoPath from "../assets/LOGO.png";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const patientID = localStorage.getItem("patient_id");

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleLogout = () => {
    localStorage.removeItem("patient_id");
    navigate("/login");
  };

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: "#0b2fa5" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box display="flex" alignItems="center">
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              ThyroPulse
            </Typography>
          </Box>
          <Box>
            <img src={logoPath} alt="Logo" style={{ height: "40px" }} />
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        variant="temporary"
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <img src={logoPath} alt="Logo" style={{ height: "60px" }} />
          </Box>

          <List>
           

            {patientID ? (
              <>
                <ListItem
                  button
                  component={Link}
                  to="/"
                  className="nav-list-item"
                  sx={{ mb: 1 }}
                >
                  <ListItemIcon>
                    <HomeIcon sx={{ color: "#0b2fa5" }} />
                  </ListItemIcon>
                  <ListItemText primary="Home" sx={{ pl: 1 }} />
                </ListItem>



                <ListItem
                  button
                  component={Link}
                  to="/track-health"
                  className="nav-list-item"
                  sx={{ mb: 1 }}
                >
                  <ListItemIcon>
                    <TrackChangesIcon sx={{ color: "#0b2fa5" }} />
                  </ListItemIcon>
                  <ListItemText primary="Track Health" sx={{ pl: 1 }} />
                </ListItem>

                <ListItem
                  button
                  component={Link}
                  to="/clinical-advice"
                  className="nav-list-item"
                  sx={{ mb: 1 }}
                >
                  <ListItemIcon>
                    <HelpOutlineIcon sx={{ color: "#0b2fa5" }} />
                  </ListItemIcon>
                  <ListItemText primary="Advice" sx={{ pl: 1 }} />
                </ListItem>

                <ListItem
                  button
                  component={Link}
                  to="/pregnancy-risk-tool"
                  className="nav-list-item"
                  sx={{ mb: 1 }}
                >
                  <ListItemIcon>
                    <PregnantWomanIcon sx={{ color: "#0b2fa5" }} />
                  </ListItemIcon>
                  <ListItemText primary="Pregnancy Risk" sx={{ pl: 1 }} />
                </ListItem>

                <ListItem
                  button
                  component={Link}
                  to="/profile"
                  className="nav-list-item"
                  sx={{ mb: 1 }}
                >
                  <ListItemIcon>
                    <AccountCircleIcon sx={{ color: "#0b2fa5" }} />
                  </ListItemIcon>
                  <ListItemText primary="Profile" sx={{ pl: 1 }} />
                </ListItem>

                <ListItem
                  button
                  onClick={handleLogout}
                  className="nav-list-item"
                  sx={{ mb: 1 }}
                >
                  <ListItemIcon>
                    <LogoutIcon sx={{ color: "#0b2fa5" }} />
                  </ListItemIcon>
                  <ListItemText primary="Logout" sx={{ pl: 1 }} />
                </ListItem>
              </>
            ) : (
              <>
                <ListItem
                  button
                  component={Link}
                  to="/LandingPage"
                  className="nav-list-item"
                  sx={{ mb: 1 }}
                >
                  <ListItemIcon>
                    <HomeIcon sx={{ color: "#0b2fa5" }} />
                  </ListItemIcon>
                  <ListItemText primary="Home" sx={{ pl: 1 }} />
                </ListItem>

                <ListItem
                  button
                  component={Link}
                  to="/login"
                  className="nav-list-item"
                  sx={{ mb: 1 }}
                >
                  <ListItemIcon>
                    <LoginIcon sx={{ color: "#0b2fa5" }} />
                  </ListItemIcon>
                  <ListItemText primary="Login" sx={{ pl: 1 }} />
                </ListItem>

                <ListItem
                  button
                  component={Link}
                  to="/signup"
                  className="nav-list-item"
                  sx={{ mb: 1 }}
                >
                  <ListItemIcon>
                    <HowToRegIcon sx={{ color: "#0b2fa5" }} />
                  </ListItemIcon>
                  <ListItemText primary="Sign Up" sx={{ pl: 1 }} />
                </ListItem>

                <ListItem
                  button
                  component={Link}
                  to="/risk-ass"
                  className="nav-list-item"
                  sx={{ mb: 1 }}
                >
                  <ListItemIcon>
                    <LoginIcon sx={{ color: "#0b2fa5" }} />
                  </ListItemIcon>
                  <ListItemText primary="RiskAss" sx={{ pl: 1 }} />
                </ListItem>

              </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
