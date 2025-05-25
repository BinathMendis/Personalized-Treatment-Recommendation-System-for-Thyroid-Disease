// NoRisk.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Paper, 
  Divider,
  List,
  ListItem,
  ListItemIcon
} from '@mui/material';
import TextField from '@mui/material/TextField';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import '../style/NoRisk.css'; // Make sure path is correct

const NoRiskPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) return <Typography>No data found.</Typography>;

  const { inputs, patient } = state;

  return (
    <Container maxWidth="md" className="result-container">
      <Paper elevation={3} className="result-card norisk">
        {/* Blue box with low risk indicator */}
        <Box className="risk-banner low-risk">
          <Box className="risk-content">
            <CheckCircleIcon className="risk-icon" />
            <Typography variant="h5" className="risk-title">Low Risk</Typography>
            <Typography variant="body1" className="risk-description">
              This patient shows minimal risk factors.
            </Typography>
          </Box>
        </Box>

        <Typography variant="h4" color="primary" align='center' gutterBottom>
          Low Risk Prediction
        </Typography>
        <Divider />

        <Typography variant="h6" gutterBottom>Patient Details</Typography>

        <Box className="row info-box">
          <TextField
            label="Name"
            value={patient.Name}
            fullWidth
            disabled
            margin="normal"
          />
          <TextField
            label="Email"
            value={patient.Email}
            fullWidth
            disabled
            margin="normal"
          />
        </Box>

        <Box className="row info-box">
          <TextField
            label="Age"
            value={patient.Age}
            fullWidth
            disabled
            margin="normal"
          />
          <TextField
            label="Gender"
            value={patient.Gender}
            fullWidth
            disabled
            margin="normal"
          />
        </Box>

        <Typography variant="h6" gutterBottom>Test Inputs</Typography>
        <Box className="row info-box">
          <TextField
            label="TPOAb"
            value={inputs.TPOAb}
            fullWidth
            disabled
            margin="normal"
          />
          <TextField
            label="TgAb"
            value={inputs.TgAb}
            fullWidth
            disabled
            margin="normal"
          />
        </Box>

        <Box className="row info-box">
          <TextField
            label="TSHRAb"
            value={inputs.TSHRAB}
            fullWidth
            disabled
            margin="normal"
          />
          <TextField
            label="Smoker"
            value={inputs.Smoker}
            fullWidth
            disabled
            margin="normal"
          />
        </Box>

        <Box className="row info-box">
          <TextField
            label="Family History"
            value={inputs.Family_History}
            fullWidth
            disabled
            margin="normal"
          />
        </Box>

        {/* Recommended Actions Section */}
        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Recommended Actions</Typography>
        <List dense={true} sx={{ padding: '0 30px' }}>
          <ListItem>
            <ListItemIcon sx={{ minWidth: '30px' }}>
              <FiberManualRecordIcon sx={{ fontSize: '10px', color: '#1976d2' }} />
            </ListItemIcon>
            Routine follow-up in 6 months
          </ListItem>
          <ListItem>
            <ListItemIcon sx={{ minWidth: '30px' }}>
              <FiberManualRecordIcon sx={{ fontSize: '10px', color: '#1976d2' }} />
            </ListItemIcon>
            Continue standard monitoring protocol
          </ListItem>
          <ListItem>
            <ListItemIcon sx={{ minWidth: '30px' }}>
              <FiberManualRecordIcon sx={{ fontSize: '10px', color: '#1976d2' }} />
            </ListItemIcon>
            Maintain healthy lifestyle recommendations
          </ListItem>
          <ListItem>
            <ListItemIcon sx={{ minWidth: '30px' }}>
              <FiberManualRecordIcon sx={{ fontSize: '10px', color: '#1976d2' }} />
            </ListItemIcon>
            Annual thyroid function screening
          </ListItem>
        </List>

        <Box className="button-group" sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Button variant="contained" color="primary" onClick={() => navigate('/')}>
              Back to Form
            </Button>
            <Button variant="contained" sx={{ ml: 2, backgroundColor: '#1976d2' }}>
              Generate PDF
            </Button>
            <Button variant="contained" sx={{ ml: 2, backgroundColor: '#1976d2' }}>
              Send via Email
            </Button>
          </Box>
        </Box>

        <Typography variant="caption" display="block" align="center" sx={{ mt: 2, color: 'text.secondary' }}>
          Report generated on: {new Date().toLocaleString()}
        </Typography>
        <Typography variant="caption" display="block" align="center" sx={{ mb: 2, color: 'text.secondary' }}>
          This assessment is for reference only and should be reviewed by a healthcare professional.
        </Typography>
      </Paper>
    </Container>
  );
};

export default NoRiskPage;