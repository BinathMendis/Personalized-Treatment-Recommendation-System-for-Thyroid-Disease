import React, { useState, useEffect } from 'react';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { useNavigate } from 'react-router-dom';  // Import useNavigate hook
import axios from 'axios';
import Swal from 'sweetalert2';
import '../style/Profile.css';

const Profile = () => {
  const [patientId, setPatientId] = useState('');
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    Age: '',
    Gender: '',  // Male or Female
    Weight: '',
    WeightUnit: '',
    Height: '',
    HeightUnit: '',
    Cholesterol: '', // Yes or No
    Pressure: '',    // Yes or No
    Diabetes: '',    // Yes or No
    Pregnancy: ''    // Yes or No
  });

  const navigate = useNavigate();  // Initialize navigate hook

  // Fetch the patient ID from localStorage when the component is mounted
  useEffect(() => {
    const storedPatientId = localStorage.getItem('patient_id');
    if (storedPatientId) {
      setPatientId(storedPatientId);  // Set the patientId from localStorage

      // Check if it's the patient's first time
      axios.get(`http://127.0.0.1:5000/personaldata/check_first_time?patient_id=${storedPatientId}`)
        .then(response => {
          setIsFirstTime(response.data.first_time); // Set the first-time status
          if (!response.data.first_time) {
            fetchProfileData(storedPatientId);
          } else {
            handleOpenModal(); // Open modal automatically for first-time login
          }
        })
        .catch(error => console.error("Error checking first-time login:", error));
    } else {
      console.error("No patient ID found in localStorage.");
    }
  }, []);

  // Fetch existing profile data if it's not the first time
  const fetchProfileData = async (patientId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/personaldata/get_thyroid_condition?patient_id=${patientId}`);
      if (response.data.length > 0) {
        setProfileData(response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission for data insert or update
  const handleSubmit = async () => {
    const endpoint = isFirstTime ? 'http://127.0.0.1:5000/personaldata/insert_thyroid_condition' : 'http://127.0.0.1:5000/personaldata/update_thyroid_condition';

    // Ensure patientId is included in the data sent to the API
    const dataToSubmit = { ...formData, patient_id: patientId };

    try {
      // Submit the form data
      await axios.post(endpoint, dataToSubmit);

      // Close the modal after successful submission
      setModalOpen(false);

      // Show SweetAlert after closing the modal
      Swal.fire({
        title: 'Success!',
        text: isFirstTime ? 'Your data has been successfully saved.' : 'Your profile has been updated successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
      });

    } catch (error) {
      // Show error alert if there's an issue with submission
      Swal.fire({
        title: 'Error!',
        text: 'There was an error submitting your data. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      console.error("Error submitting data:", error);
    }
  };

  const showFirstTimePopup = () => {
    Swal.fire({
      title: 'Welcome!',
      text: 'It looks like you\'re logging in for the first time. Please enter your details.',
      icon: 'info',
      confirmButtonText: 'OK'
    }).then(() => {
      setModalOpen(true);
    });
  };

  // Handle opening and closing of the modal
  const handleOpenModal = () => {
    setModalOpen(true);
    if (profileData) {
      setFormData({
        Age: profileData.Age || '',
        Gender: profileData.Gender || '',
        Weight: profileData['Weight (kg)'] || '',
        WeightUnit: '',
        Height: profileData['Height (cm)'] || '',
        HeightUnit: '',
        Cholesterol: profileData.Cholesterol || '',
        Pressure: profileData.Pressure || '',
        Diabetes: profileData.Diabetes || '',
        Pregnancy: profileData.Pregnancy || ''
      });
    }
  };

  const handleCloseModal = () => {
    // Temporarily close the modal
    setModalOpen(false);

    // Show SweetAlert when cancel is clicked
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will lose any unsaved changes!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel',
      cancelButtonText: 'No, stay'
    }).then((result) => {
      if (result.isConfirmed) {
        // Permanently close the modal after SweetAlert confirms cancellation
        setModalOpen(false);
        Swal.fire({
          title: 'Cancelled!',
          text: 'Your changes have been discarded.',
          icon: 'info',
          confirmButtonText: 'OK'
        });
      } else {
        // Reopen the modal if SweetAlert is rejected
        setModalOpen(true);
      }
    });
  };

  const handleLogout = async () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          localStorage.removeItem("patient_id");
          await axios.post("http://127.0.0.1:5000/auth/logout");
          Swal.fire('Logged Out!', 'You have been logged out successfully.', 'success');
          navigate("/login");
        } catch (error) {
          console.error("Logout failed", error);
        }
      }
    });
  };


  return (
    <div>
      {/* Profile Container */}
      <div className="profile-container">
        <Typography variant="h4">Patient Profile</Typography>

        {isFirstTime ? (
          <Typography variant="body1">Please Update Your Profile</Typography>
        ) : (
          <div>
            <Typography variant="body1">
              Your profile data has been loaded. If you want to update, click the button below.
            </Typography>
            <div className="profile-data">
              <Typography variant="body1"><strong>Age:</strong> {profileData?.Age || 'N/A'}</Typography>
              <Typography variant="body1"><strong>Gender:</strong> {profileData?.Gender || 'N/A'}</Typography>
              <Typography variant="body1"><strong>Weight:</strong> {profileData?.['Weight (kg)'] || 'N/A'}</Typography>
              <Typography variant="body1"><strong>Height:</strong> {profileData?.['Height (cm)'] || 'N/A'}</Typography>
              <Typography variant="body1"><strong>Cholesterol:</strong> {profileData?.Cholesterol || 'N/A'}</Typography>
              <Typography variant="body1"><strong>Pressure:</strong> {profileData?.Pressure || 'N/A'}</Typography>
              <Typography variant="body1"><strong>Diabetes:</strong> {profileData?.Diabetes || 'N/A'}</Typography>
              <Typography variant="body1"><strong>Pregnancy:</strong> {profileData?.Pregnancy || 'N/A'}</Typography>
            </div>
            <Button variant="contained" color="primary" onClick={handleOpenModal}>
              Update Profile
            </Button>
            <Button variant="contained" color="" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        )}

        {/* Modal for entering/updating data */}
        <Dialog open={modalOpen} onClose={handleCloseModal}>
          <DialogTitle>{isFirstTime ? 'Enter Your Data' : 'Update Your Data'}</DialogTitle>
          <DialogContent>
            <TextField
              label="Age"
              type="number"
              name="Age"
              value={formData.Age}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />

            {/* Gender Selection */}
            <FormControl fullWidth margin="normal" required>
              <FormLabel>Gender</FormLabel>
              <RadioGroup
                name="Gender"
                value={formData.Gender}
                onChange={handleInputChange}
              >
                <FormControlLabel value="Male" control={<Radio />} label="Male" />
                <FormControlLabel value="Female" control={<Radio />} label="Female" />
              </RadioGroup>
            </FormControl>

            <TextField
              label="Weight (kg)"
              type="number"
              name="Weight"
              value={formData.Weight}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Height (cm)"
              type="number"
              name="Height"
              value={formData.Height}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />

            {/* Medical Conditions (Yes/No) */}
            <FormControl fullWidth margin="normal" required>
              <FormLabel>Cholesterol</FormLabel>
              <RadioGroup
                name="Cholesterol"
                value={formData.Cholesterol}
                onChange={handleInputChange}
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>

            <FormControl fullWidth margin="normal" required>
              <FormLabel>Pressure</FormLabel>
              <RadioGroup
                name="Pressure"
                value={formData.Pressure}
                onChange={handleInputChange}
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>

            <FormControl fullWidth margin="normal" required>
              <FormLabel>Diabetes</FormLabel>
              <RadioGroup
                name="Diabetes"
                value={formData.Diabetes}
                onChange={handleInputChange}
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>

            <FormControl fullWidth margin="normal" required>
              <FormLabel>Pregnancy</FormLabel>
              <RadioGroup
                name="Pregnancy"
                value={formData.Pregnancy}
                onChange={handleInputChange}
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default Profile;
