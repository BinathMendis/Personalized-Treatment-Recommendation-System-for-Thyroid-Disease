import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Container,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import '../style/Pregnancy.css';

const Pregnancy = () => {
  const navigate = useNavigate();

  const [patient, setPatient] = useState({
    name: '',
    Age: '',
    Email: '',
    Gender: ''
  });

  const [TPOAb, setTPOAb] = useState('');
  const [TgAb, setTgAb] = useState('');
  const [TSHRAB, setTSHRAB] = useState('');
  const [Smoker, setSmoker] = useState('No');
  const [FamilyHistory, setFamilyHistory] = useState('No');

  // TSH prediction values
  const [tshPrediction, setTshPrediction] = useState({
    input_tsh: '',
    predicted_tsh: '',
    date: ''
  });

  useEffect(() => {
    const id = localStorage.getItem('patient_id');
    if (!id) return;

    // Fetch patient info
    axios.get(`http://127.0.0.1:5000/pregnancy/patient/${id}`)
      .then((res) => setPatient(res.data))
      .catch((err) => {
        console.error(err);
        Swal.fire('Error', 'Failed to load patient details', 'error');
      });

    // Fetch TSH prediction info
    axios.get(`http://127.0.0.1:5000/api/get-latest-tsh?patient_id=${id}`)
      .then((res) => {
        if (res.data.input_tsh !== undefined) {
          setTshPrediction(res.data);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const patientId = localStorage.getItem('patient_id');

    if (!patientId || !TPOAb || !TgAb || !TSHRAB) {
      Swal.fire('Error', 'Please fill in all required fields', 'error');
      return;
    }

    const data = {
      Patient_ID: patientId,
      Age: patient.Age,
      TPOAb,
      TgAb,
      TSHRAB,
      Smoker,
      Family_History: FamilyHistory
    };

    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/pregnancy/predict',
        data
      );
      const riskStatus = response.data.predicted_risk === 1 ? 'high' : 'low';

      Swal.fire({
        title: 'Prediction Successful',
        text: `The predicted risk is ${riskStatus}.`,
        icon: riskStatus === 'high' ? 'warning' : 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        navigate(`/risk/${riskStatus}`, {
          state: {
            prediction: riskStatus,
            inputs: data,
            patient
          }
        });
      });
    } catch (error) {
      Swal.fire(
        'Error',
        error.response?.data?.error || 'Something went wrong!',
        'error'
      );
    }
  };

  return (
    <Container maxWidth="md" className="form-container">
      <Typography variant="h4" gutterBottom>
        Pregnancy Risk Prediction
      </Typography>

      <form onSubmit={handleSubmit}>
        {/* Patient Details */}
        <Typography variant="h6" gutterBottom>
          Patient Details
        </Typography>
        <Box className="row">
          <TextField label="Name" value={patient.name} fullWidth disabled margin="normal" />
          <TextField label="Email" value={patient.Email} fullWidth disabled margin="normal" />
        </Box>
        <Box className="row">
          <TextField label="Age" value={patient.Age} fullWidth disabled margin="normal" />
          <TextField label="Gender" value={patient.Gender} fullWidth disabled margin="normal" />
        </Box>

        {/* TSH Prediction Details */}
        {tshPrediction.input_tsh && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" gutterBottom>
              TSH Prediction
            </Typography>
            <Box className="row">
              <TextField
                label="Current TSH"
                value={tshPrediction.input_tsh}
                fullWidth
                disabled
                margin="normal"
              />
              <TextField
                label="Previous Predicted TSH"
                value={tshPrediction.predicted_tsh}
                fullWidth
                disabled
                margin="normal"
              />
              <TextField
                label="Prediction Date"
                value={tshPrediction.date}
                fullWidth
                disabled
                margin="normal"
              />
            </Box>
          </>
        )}

        <Divider sx={{ my: 3 }} />

        {/* Medical Test Details */}
        <Typography variant="h6" gutterBottom>
          Medical Test Details
        </Typography>
        <Box className="row">
          <TextField
            label="TPOAb"
            variant="outlined"
            fullWidth
            value={TPOAb}
            onChange={(e) => setTPOAb(e.target.value)}
            required
            margin="normal"
          />
          <TextField
            label="TgAb"
            variant="outlined"
            fullWidth
            value={TgAb}
            onChange={(e) => setTgAb(e.target.value)}
            required
            margin="normal"
          />
        </Box>
        <Box className="row">
          <TextField
            label="TSHRAB"
            variant="outlined"
            fullWidth
            value={TSHRAB}
            onChange={(e) => setTSHRAB(e.target.value)}
            required
            margin="normal"
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Risk Details */}
        <Typography variant="h6" gutterBottom>
          Risk Details
        </Typography>
        <Box className="row">
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Smoker</InputLabel>
            <Select
              value={Smoker}
              onChange={(e) => setSmoker(e.target.value)}
              label="Smoker"
            >
              <MenuItem value="No">No</MenuItem>
              <MenuItem value="Yes">Yes</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Family History</InputLabel>
            <Select
              value={FamilyHistory}
              onChange={(e) => setFamilyHistory(e.target.value)}
              label="Family History"
            >
              <MenuItem value="No">No</MenuItem>
              <MenuItem value="Yes">Yes</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Button variant="contained" color="primary" type="submit" fullWidth>
          Submit
        </Button>
      </form>
    </Container>
  );
};

export default Pregnancy;
