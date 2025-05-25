import React, { useEffect, useState } from 'react';
import { Grid, Typography, Card, CardContent } from '@mui/material';
import TSHTrendChart from '../component/Charts/TSHTrendChart';
import WeightTrendChart from '../component/Charts/WeightTrendChart';
import TSHvWeightScatter from '../component/Charts/TSHvWeightScatter';

const TrendsDashboard = () => {
  const [trendData, setTrendData] = useState([]);
  const [patientId, setPatientId] = useState(null);

  useEffect(() => {
    // Get patient ID from localStorage
    const storedId = localStorage.getItem("patient_id");
    if (storedId) {
      setPatientId(storedId);
    } else {
      console.error("No patientId found in localStorage.");
    }
  }, []);

  useEffect(() => {
    if (patientId) {
      fetch(`http://127.0.0.1:5000/charts/api/patient_trends/${patientId}`)
        .then(res => res.json())
        .then(data => setTrendData(data))
        .catch(err => console.error("Error fetching trend data:", err));
    }
  }, [patientId]);

  return (
    <div style={{ padding: '2rem' }}>
      <Typography variant="h4" gutterBottom>Patient Trends</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">TSH Trend</Typography>
              <TSHTrendChart data={trendData} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Weight Trend</Typography>
              <WeightTrendChart data={trendData} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">TSH vs Weight</Typography>
              <TSHvWeightScatter data={trendData} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default TrendsDashboard;
