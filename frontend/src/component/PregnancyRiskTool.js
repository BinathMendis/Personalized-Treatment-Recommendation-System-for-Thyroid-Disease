import React from "react";
import { Button, Typography, Box, Grid } from "@mui/material";
import { Favorite, AccessTime, HealthAndSafety, Assessment } from "@mui/icons-material";
import "../style/PregnancyRiskTool.css"; // Make sure path is correct
import { useNavigate } from "react-router-dom";

const PregnancyRiskTool = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/predict"); // or any desired route
  };

  return (
    <div className="container">
      {/* TOP BLUE SECTION */}
      <Box className="blueBox">
        <Typography variant="h4" className="heading" fontFamily={"Poetsen One"}>
          PREGNANCY RISK PREDICTION TOOL
        </Typography>
        
        <Typography variant="body1" className="subText">
          Advanced analytics for healthcare professionals to assess<br /> and predict pregnancy risks.
        </Typography>
        <Button
          variant="contained"
          className="startAssessmentBtn"
          onClick={handleStart}
        >
          Start Assessment
        </Button>
      </Box>

      {/* The rest of your layout comes below */}
      {/* Key Features Title */}
      <Typography variant="h5" className="sectionTitle">
        Key Features
      </Typography>

      {/* Icons */}
      <div className="iconContainer">
  <div className="iconItem">
    <HealthAndSafety className="icon" />
    <Typography>Health Monitoring</Typography>
    <Typography></Typography>
    <Typography className="iconDescription">
      Track your health vitals continuously and easily.
    </Typography>
  </div>
  <div className="iconItem">
    <AccessTime className="icon" />
    <Typography>Accurate Results</Typography>
    <Typography></Typography>
    <Typography className="iconDescription">
      Get precise and reliable test outcomes instantly.
    </Typography>
  </div>
  <div className="iconItem">
    <Favorite className="icon" />
    <Typography>Personalized Care</Typography>
    <Typography></Typography>
    <Typography className="iconDescription">
      Care plans tailored exactly to your needs.
    </Typography>
  </div>
  <div className="iconItem">
    <Assessment className="icon" />
    <Typography>Risk Assessment</Typography>
    <Typography></Typography>
    <Typography className="iconDescription">
      Identify and manage health risks proactively.
    </Typography>
  </div>
</div>



      {/* CTA */}
      <Typography variant="h5" className="sectionTitle">
        Ready to Start
      </Typography>
      <Typography className="subText2">
        Let's start this immediately
      </Typography>
      <Button variant="contained" className="startBtn" onClick={handleStart}>
        Start
      </Button>
    </div>
  );
};

export default PregnancyRiskTool;
