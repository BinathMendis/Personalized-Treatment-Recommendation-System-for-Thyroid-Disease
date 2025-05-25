import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  List, 
  ListItem, 
  CircularProgress,
  Box,
  Grid,
  Divider,
  Paper,
  Chip
} from "@mui/material";
import { styled } from '@mui/material/styles';
import Swal from 'sweetalert2';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import LocalDiningIcon from '@mui/icons-material/LocalDining';

const FoodCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  marginBottom: theme.spacing(2),
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 24px rgba(0, 0, 0, 0.12)'
  },
  borderLeft: '4px solid',
  borderLeftColor: theme.palette.primary.main,
  backgroundColor: theme.palette.background.paper
}));

const ClinicalCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  backgroundColor: theme.palette.grey[50],
  padding: theme.spacing(3),
  borderLeft: '4px solid',
  borderLeftColor: theme.palette.secondary.main,
  height: '100%'
}));

const FoodRecommendations = () => {
  const [patientId, setPatientId] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const storedPatientId = localStorage.getItem("patient_id");
    if (storedPatientId) {
      setPatientId(storedPatientId);
      fetchRecommendations(storedPatientId);
    } else {
      setError("No Patient ID found in local storage.");
      showErrorAlert("No Patient ID found in local storage.");
    }
  }, []);

  const fetchRecommendations = async (id) => {
    setLoading(true);
    setError("");
    
    const swalLoading = Swal.fire({
      title: 'Analyzing Nutritional Data',
      html: '<p>Generating personalized food recommendations...</p><div class="swal2-progress-steps" style="width:100%"></div>',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      background: '#ffffff',
      showConfirmButton: false
    });

    const interval = setInterval(() => {
      setElapsedTime((prevTime) => prevTime + 1);
    }, 1000);

    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/recommend/food_recommendations?patient_id=${id}`
      );
      setData(response.data);
      clearInterval(interval);
      swalLoading.close();
      showSuccessAlert("Personalized recommendations generated!");
    } catch (err) {
      setError("Failed to fetch data. Please check the Patient ID.");
      console.error(err);
      clearInterval(interval);
      swalLoading.close();
      showErrorAlert("Failed to fetch data. Please check the Patient ID.");
    } finally {
      setLoading(false);
    }
  };

  const showSuccessAlert = (message) => {
    Swal.fire({
      title: 'Success!',
      text: message,
      icon: 'success',
      confirmButtonText: 'OK',
      confirmButtonColor: '#1976d2',
      background: '#ffffff'
    });
  };

  const showErrorAlert = (message) => {
    Swal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      confirmButtonText: 'OK',
      confirmButtonColor: '#d32f2f',
      background: '#ffffff'
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ 
        textAlign: 'center', 
        mb: 6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700, 
            mb: 1,
            color: 'text.primary',
            letterSpacing: '0.5px'
          }}
        >
          Personalized Nutrition Guide
        </Typography>
        <Chip 
          label="Based on your health profile" 
          color="primary" 
          variant="outlined"
          sx={{ borderRadius: '8px' }}
        />
      </Box>

      {loading && (
        <Paper elevation={0} sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
          backgroundColor: 'background.paper',
          textAlign: 'center'
        }}>
          <CircularProgress size={60} thickness={4} sx={{ color: 'primary.main', mb: 3 }} />
          <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AccessTimeIcon sx={{ mr: 1, color: 'text.secondary' }} /> 
            <Box component="span" sx={{ color: 'text.primary' }}>
              Analyzing your nutritional data...
            </Box>
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
            Elapsed time: {elapsedTime} seconds
          </Typography>
        </Paper>
      )}

      {error && (
        <Paper elevation={0} sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          backgroundColor: 'error.light'
        }}>
          <Typography color="error.dark">
            {error}
          </Typography>
        </Paper>
      )}

      {data && (
        <Grid container spacing={4}>
          <Grid item xs={4} md={4}>
            <Card elevation={0} sx={{ mb: 4, backgroundColor: 'transparent' }}>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <RestaurantIcon sx={{ 
                    fontSize: 32, 
                    mr: 2, 
                    color: 'primary.main' 
                  }} />
                  <Typography variant="h5" sx={{ 
                    fontWeight: 600,
                    color: 'text.primary'
                  }}>
                    Dietary Profile
                  </Typography>
                </Box>
                
                <Paper elevation={0} sx={{ 
                  p: 3, 
                  mb: 4, 
                  borderRadius: 2,
                  backgroundColor: 'background.paper'
                }}>
                  <Typography variant="subtitle1" sx={{ 
                    mb: 1,
                    color: 'text.secondary',
                    fontWeight: 500
                  }}>
                    CATEGORY
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    color: 'text.primary',
                    lineHeight: 1.6
                  }}>
                    {data.category_description || "No description available."}
                  </Typography>
                </Paper>

                <Typography variant="h6" sx={{ 
                  mb: 3,
                  color: 'text.primary',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <LocalDiningIcon sx={{ mr: 1.5 }} />
                  Recommended Foods
                </Typography>

                <Box sx={{ mb: 2 }}>
                  {data.recommended_foods?.map((food, index) => (
                    <FoodCard key={index}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ 
                            width: 32, 
                            height: 32, 
                            backgroundColor: 'primary.main', 
                            color: 'common.white',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 2,
                            fontWeight: 600
                          }}>
                            {index + 1}
                          </Box>
                          <Typography variant="body1" sx={{ 
                            fontWeight: 500,
                            color: 'text.primary'
                          }}>
                            {food}
                          </Typography>
                        </Box>
                      </CardContent>
                    </FoodCard>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <ClinicalCard>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <MedicalInformationIcon sx={{ 
                  fontSize: 32, 
                  mr: 2, 
                  color: '#0b2fa5' 
                }} />
                <Typography variant="h5" sx={{ 
                  fontWeight: 600,
                  color: 'text.primary'
                }}>
                  Clinical Advice
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              {data.clinical_advice && (
                <Box sx={{ 
                  '& > *': { 
                    mb: 2,
                    position: 'relative',
                    pl: 3,
                    '&::before': {
                      content: '"•"',
                      position: 'absolute',
                      left: 0,
                      color: '#0b2fa5',
                      fontWeight: 'bold',
                      fontSize: '24px',
                      lineHeight: '1'
                    }
                  } 
                }}>
                  {data.clinical_advice.split("\n").map((line, index) => (
                    <Typography key={index} variant="body1" sx={{ 
                      color: 'text.primary',
                      lineHeight: 1.7
                    }}>
                      {line}
                    </Typography>
                  ))}
                </Box>
              )}
            </ClinicalCard>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default FoodRecommendations;