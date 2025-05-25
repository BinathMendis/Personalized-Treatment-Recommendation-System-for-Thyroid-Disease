import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    TextField, Button, Grid, Typography, Container, CircularProgress, Paper,
    Card, CardContent, IconButton, Tooltip, Dialog, DialogTitle, DialogContent,
    DialogContentText, DialogActions,Box, Divider, LinearProgress, HorizontalRule
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../style/TrackHealth.css';

import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';
import HeightIcon from '@mui/icons-material/Height';
import PersonIcon from '@mui/icons-material/Person';
import OpacityIcon from '@mui/icons-material/Opacity';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import FemaleIcon from '@mui/icons-material/Female';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Chip from '@mui/material/Chip';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import LabReportSample from '../assets/labreport.png'; // Import sample lab report image
import Stack from '@mui/material/Stack';

function TrackHealth() {
    const [inputParameter, setInputParameter] = useState('');
    const [result, setResult] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [patientId, setPatientId] = useState('');
    const [loading, setLoading] = useState(false);
    const [patientData, setPatientData] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [latestPrediction, setLatestPrediction] = useState(null);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const id = localStorage.getItem('patient_id');
        if (id) {
            setPatientId(id);
            fetchPatientData(id);
        } else {
            setErrorMessage('Patient ID is not available. Please log in again.');
        }
    }, []);

    const fetchPatientData = async (id) => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/tsh/get_patient_data', {
                patient_id: id
            });

            if (response.data.patient_data) {
                setPatientData(response.data.patient_data);
            } else {
                setErrorMessage("No patient data found.");
            }
        } catch (error) {
            console.error("Failed to fetch patient data", error);
            setErrorMessage("Failed to fetch patient data.");
        }
    };

        useEffect(() => {
                const fetchLatestTSH = async () => {
                    try {
                        const response = await axios.get("http://127.0.0.1:5000/tsh/api/get-latest-tsh", {
                            params: { patient_id: patientId },
                        });

                        if (response.data.input_tsh) {
                            setLatestPrediction(response.data);
                        } else {
                            setLatestPrediction(null);
                        }
                    } catch (err) {
                        setError("Failed to fetch previous TSH prediction");
                        console.error(err);
                    }
                };

                if (patientId) {
                    fetchLatestTSH();
                }
            }, [patientId]);


    
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!inputParameter) {
            setErrorMessage('Please provide the TSH input parameter.');
            Swal.fire({
                title: 'Error!',
                text: 'Please provide the TSH input parameter.',
                icon: 'error',
                confirmButtonText: 'Try Again'
            });
            return;
        }

        const tshValue = parseFloat(inputParameter);

        if (tshValue >= 0.4 && tshValue <= 4) {
            Swal.fire({
                title: 'Good News!',
                text: 'Your TSH value is within the normal range 0.4 to 4.5 mIU/L, which is considered good. No need to set a goal. Keep up the good health!',
                icon: 'success',
                confirmButtonText: 'OK'
            });
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('http://127.0.0.1:5000/tsh/track_health', {
                patient_id: patientId,
                input_parameter: tshValue,
            });

            if (response.data.predicted_tsh) {
                Swal.fire({
                    title: 'Success!',
                    text: `Your goal is set to ${response.data.predicted_tsh} mIU/L on your next TSH Report.`,
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    setResult(response.data);
                    setErrorMessage('');
                    setLoading(false);
                });
            }
        } catch (error) {
            setErrorMessage('Error: Unable to fetch prediction from the server.');
            Swal.fire({
                title: 'Error!',
                text: 'Unable to fetch prediction from the server.',
                icon: 'error',
                confirmButtonText: 'Try Again'
            });
            setLoading(false);
            console.error('Error:', error);
        }
    };

    const iconMap = {
        Age: <CalendarMonthIcon fontSize="large" />,
        Gender: <PersonIcon fontSize="large" />,
        Weight: <MonitorWeightIcon fontSize="large" />,
        Height: <HeightIcon fontSize="large" />,
        Diabetes: <OpacityIcon fontSize="large" />,
        Cholesterol: <WaterDropIcon fontSize="large" />,
        BloodPressure: <BloodtypeIcon fontSize="large" />,
        Pregnancy: <FemaleIcon fontSize="large" />,
    };


    const getTshColor = (value) => {
        if (value < 0.4) return '#ff7043'; // Orange for hyperthyroid
        if (value <= 4) return '#4caf50';  // Green for normal
        return '#f44336';                  // Red for hypothyroid
    };

    const getTshStatus = (value) => {
        if (value < 0.4) return { label: 'Hyperthyroid', color: 'error' };
        if (value <= 4) return { label: 'Normal', color: 'success' };
        return { label: 'Hypothyroid', color: 'warning' };
    };

    const getImprovementDirection = (current, predicted) => {
        const diff = predicted - current;
        if (Math.abs(diff) < 0.5) return 'neutral';
        return diff > 0 ? 'worsening' : 'improving';
    };

    const getImprovementStatus = (current, predicted) => {
        const diff = predicted - current;
        if (Math.abs(diff) < 0.5) return 'Stable';
        return diff > 0 ? 'Needs Improvement' : 'Improving';
    };

    const getImprovementColor = (current, predicted) => {
        const diff = predicted - current;
        if (Math.abs(diff) < 0.5) return 'default';
        return diff > 0 ? 'warning' : 'success';
    };

    const TshRangeIndicator = ({ value }) => (
        <Box sx={{ 
            width: '100%',
            height: '8px',
            bgcolor: '#e0e0e0',
            borderRadius: '4px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <Box sx={{
            position: 'absolute',
            left: '0%',
            right: '0%',
            height: '100%',
            background: 'linear-gradient(90deg, #ff7043 0%, #4caf50 50%, #ff7043 100%)',
            }} />
            <Box sx={{
            position: 'absolute',
            left: `${Math.min(Math.max((value / 10) * 100, 0), 100)}%`,
            top: '-6px',
            width: '2px',
            height: '20px',
            bgcolor: 'black',
            transform: 'translateX(-50%)'
            }} />
        </Box>
        );



    return (
        <>
            <Paper elevation={3} className="tsh-welcome-box">
                <div>
                    <Typography variant="h4" className="heading" fontFamily={"Poetsen One"}>
                        TSH LEVEL PREDICTION TOOL
                    </Typography>
                    <Typography variant="body1" className="subText">
                        Advanced analytics for healthcare professionals to assess<br /> and predict next TSH level.
                    </Typography>
                </div>
            </Paper>


        <Container maxWidth="sm" className="track-health-container">
                <Typography variant="h4" align="center" gutterBottom>
                Get Your Next TSH Goal
                </Typography>

        {/* Updated instruction header with icon and text centered and aligned */}
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          spacing={0.5}
          style={{ marginBottom: '10px' }}
        >
          <Grid item>
            <Typography
              variant="subtitle1"
              style={{ color: 'black', cursor: 'default', userSelect: 'none' }}
            >
              How to enter your TSH value
            </Typography>
          </Grid>
          <Grid item>
            <Tooltip title="Instructions to find TSH from lab report">
              <IconButton
                onClick={() => setOpenDialog(true)}
                size="small"
                aria-label="TSH Instructions"
                style={{ color: '#0b2fa5' }}  // icon color set to black
              >
                <InfoOutlinedIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>

        {/* The rest remains unchanged */}
        <form onSubmit={handleSubmit}>
          <Grid item xs={12}>
            <TextField
              label="Enter your TSH Value"
              value={inputParameter}
              onChange={(e) => setInputParameter(e.target.value)}
              variant="outlined"
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} style={{ marginTop: '16px' }}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Get TSH Prediction
            </Button>
          </Grid>
        </form>

        {errorMessage && (
          <Typography color="error" align="center">
            {errorMessage}
          </Typography>
        )}

        {loading && (
          <div
            className="loading-container"
            style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
          >
            <CircularProgress />
          </div>
        )}

        {result && (
          <div className="result-container">
            <Typography variant="h6" gutterBottom>
              Result
            </Typography>
            <Typography>
              Your goal is set to {result.predicted_tsh} mIU/L on your next TSH Report
            </Typography>
          </div>
        )}

        {result && (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: '20px' }}
            onClick={() => navigate('/food-recommendations')}
          >
            Get Food Recommendations
          </Button>
        )}
      </Container>

        {latestPrediction && (
            <Container maxWidth="md" sx={{ my: 6 }}>
                <Typography variant="h6" gutterBottom sx={{ 
                fontWeight: 600,
                color: 'text.primary',
                mb: 3,
                textAlign: 'center'
                }}>
                TSH PROGRESS TRACKING
                </Typography>
                <Divider sx={{ mb: 4 }} />
                
                <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Card variant="outlined" sx={{ p: 3, height: '100%' }}>
                    <Stack spacing={2} alignItems="center">
                        <Typography variant="subtitle1" color="text.secondary">
                        Current TSH Level
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700 }} color="black">
                        {latestPrediction.input_tsh} mIU/L
                        </Typography>
                        <Chip 
                        label={getTshStatus(latestPrediction.input_tsh).label}
                        color={getTshStatus(latestPrediction.input_tsh).color}
                        variant="outlined"
                        size="small"
                        />
                        <Box sx={{ width: '100%', mt: 2 }}>
                        <LinearProgress 
                            variant="determinate" 
                            value={Math.min(latestPrediction.input_tsh * 10, 100)} 
                            sx={{
                            height: 6,
                            borderRadius: 3,
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: getTshStatus(latestPrediction.input_tsh).color === 'success' ? '#4caf50' : 
                                                getTshStatus(latestPrediction.input_tsh).color === 'error' ? '#f44336' : '#ff9800'
                            }
                            }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                            <Typography variant="caption">0.1</Typography>
                            <Typography variant="caption">4.0</Typography>
                            <Typography variant="caption">10.0</Typography>
                        </Box>
                        </Box>
                    </Stack>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card variant="outlined" sx={{ p: 3, height: '100%' }}>
                    <Stack spacing={2} alignItems="center">
                        <Typography variant="subtitle1" color="text.secondary">
                        Predicted TSH Level
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700 }} color="black">
                        {latestPrediction.predicted_tsh} mIU/L
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getImprovementDirection(latestPrediction.input_tsh, latestPrediction.predicted_tsh) === 'improving' ? (
                            <ArrowDownward color="success" sx={{ mr: 1 }} />
                            ) : getImprovementDirection(latestPrediction.input_tsh, latestPrediction.predicted_tsh) === 'worsening' ? (
                            <ArrowUpward color="error" sx={{ mr: 1 }} />
                            ) : (
                            <Divider orientation="horizontal" sx={{ 
                                width: 24, 
                                borderColor: 'text.disabled',
                                borderBottomWidth: 2,
                                mr: 1
                            }} />
                            )}
                        <Chip 
                            label={
                            getImprovementDirection(latestPrediction.input_tsh, latestPrediction.predicted_tsh) === 'improving' ? 'Improving' :
                            getImprovementDirection(latestPrediction.input_tsh, latestPrediction.predicted_tsh) === 'worsening' ? 'Needs Attention' : 'Stable'
                            }
                            color={
                            getImprovementDirection(latestPrediction.input_tsh, latestPrediction.predicted_tsh) === 'improving' ? 'success' :
                            getImprovementDirection(latestPrediction.input_tsh, latestPrediction.predicted_tsh) === 'worsening' ? 'warning' : 'default'
                            }
                            size="small"
                            variant="outlined"
                        />
                        </Box>
                        <Typography variant="body2" color="text.secondary" align="center">
                        {getImprovementDirection(latestPrediction.input_tsh, latestPrediction.predicted_tsh) === 'improving' ?
                            'Your levels are trending positively' :
                            getImprovementDirection(latestPrediction.input_tsh, latestPrediction.predicted_tsh) === 'worsening' ?
                            'Consult your healthcare provider' : 'Levels remain stable'}
                        </Typography>
                    </Stack>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card variant="outlined" sx={{ p: 3, height: '100%' }}>
                    <Stack spacing={2} alignItems="center">
                        <Typography variant="subtitle1" color="text.secondary">
                        Last Prediction Date
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 600 }} color="black">
                        {new Date(latestPrediction.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        }) }
                        </Typography>
                        <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            Next recommended test:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }} color="black"> 
                            {new Date(new Date(latestPrediction.date).setMonth(
                            new Date(latestPrediction.date).getMonth() + 3
                            )).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                            })}
                        </Typography>
                        </Box>
                        <Button 
                        variant="outlined" 
                        size="small" 
                        sx={{ mt: 1 }}
                        onClick={() => navigate('/test-history')}
                        >
                        View History
                        </Button>
                    </Stack>
                    </Card>
                </Grid>
                </Grid>
            </Container>
            )}

            {patientData && (
                <>
                    <Typography
                        variant="h5"
                        align="center"
                        gutterBottom
                        style={{ marginTop: '30px', color: '#0b2fa5' , fontWeight: 'bold' }}
                    >
                        Hi {patientData.Name}, these are your current medical details
                    </Typography>
                    <Grid container spacing={2} className="patient-data-grid">
                    {Object.entries(patientData).map(([key, value]) => {

                                if (key === "Name") return null;
                                let displayValue = value;

                                // Convert booleans to Yes/No
                                if (typeof value === "boolean") {
                                    displayValue = value ? "Yes" : "No";
                                }

                                // Append units for Height and Weight
                                if (key === "Height") {
                                    displayValue = `${value} cm`;
                                } else if (key === "Weight") {
                                    displayValue = `${value} kg`;
                                }

                                return (
                                    <Grid item xs={6} sm={3} key={key}>
                                        <Card className="health-card" style={{ minHeight: '100px', padding: '8px' }}>
                                        <CardContent style={{ padding: '8px' }}>
                                            {iconMap[key]}
                                            <Typography variant="h6" gutterBottom style={{ fontSize: '16px' }}>{key}</Typography>
                                            <Typography variant="body1" style={{ fontSize: '14px' }}>{displayValue}</Typography>
                                        </CardContent>
                                        </Card>
                                    </Grid>
                                );
                            })}

                        </Grid>
                        </>
                    )}

            

      {/* Instruction Dialog remains unchanged */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle sx={{ color: 'black' }}>
            How to Find Your TSH Value
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            1. Take your most recent lab report.
            <br />
            2. Look for a section named <strong>“Thyroid Function Test”</strong> or{' '}
            <strong>“Hormone Levels”</strong>.
            <br />
            3. Find the line labeled <strong>“TSH”</strong> or{' '}
            <strong>“Thyroid Stimulating Hormone”</strong>.
            <br />
            4. The value listed next to it (in mIU/L) is your current TSH level.
            <br />
            <br />
            Example:
            <br />
            TSH: <strong>0.37 mIU/L</strong>
          </DialogContentText>

          <img
            src={LabReportSample}
            alt="Sample Lab Report"
            style={{ marginTop: '20px', maxWidth: '100%', borderRadius: '8px' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary" autoFocus>
            Got it
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default TrackHealth;
