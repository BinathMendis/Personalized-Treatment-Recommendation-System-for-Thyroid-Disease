import React from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, Container, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import medicalTeam from '../assets/medicalTeam.jpg';
import pregnancyRisk from '../assets/pregnancy-risk.jpg';
import thyroidAssessment from '../assets/thyroid-assessment.jpg';
import nodulesAnalysis from '../assets/nodules-analysis.jpg';
import dietTracking from '../assets/diet-tracking.jpeg';
import labReport from '../assets/labreport.png';
import medication from '../assets/medication.jpg';
import '../style/TrendsDashboard.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <Container maxWidth="xl" className="hero-container">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" className="hero-title">
                Advanced Thyroid Care Platform
              </Typography>
              <Typography variant="h5" className="hero-subtitle">
                Precision monitoring and personalized management for all thyroid conditions
              </Typography>
              <Box className="hero-actions">
                <Button 
                  variant="contained" 
                  size="large" 
                  className="primary-button"
                  onClick={() => navigate('/signup')}
                >
                  Get Started
                </Button>
                <Button 
                  variant="outlined" 
                  size="large" 
                  className="secondary-button"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <img src={medicalTeam} alt="Thyroid care team" className="hero-image" />
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* Thyroid Education Section */}
      <section className="education-section">
        <Container maxWidth="xl">
          <Typography variant="h3" className="section-title" align="center">
            Understanding Thyroid Disorders
          </Typography>
          <Typography variant="body1" className="section-description" align="center">
            The thyroid gland produces hormones that regulate metabolism, heart rate, body temperature, 
            and calcium balance. Approximately 12% of people will develop thyroid dysfunction during their lifetime.
          </Typography>
          
          <Grid container spacing={4} className="education-grid">
            <Grid item xs={12} md={6}>
              <Card className="education-card">
                <CardContent>
                  <Typography variant="h5" className="education-title">
                    Thyroid Hormones & Function
                  </Typography>
                  <div className="education-list">
                    <div className="education-list-item"><strong>TSH (Thyroid Stimulating Hormone)</strong>: 0.4-4.0 mIU/L (optimal range varies by trimester during pregnancy)</div>
                    <div className="education-list-item"><strong>Free T4</strong>: 0.8-1.8 ng/dL (direct measure of thyroid output)</div>
                    <div className="education-list-item"><strong>Free T3</strong>: 2.3-4.2 pg/mL (active thyroid hormone)</div>
                    <div className="education-list-item"><strong>Thyroid Antibodies</strong>: TPO and TG antibodies indicate autoimmune activity</div>
                  </div>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card className="education-card">
                <CardContent>
                  <Typography variant="h5" className="education-title">
                    Common Disorders & Symptoms
                  </Typography>
                  <div className="education-list">
                    <div className="education-list-item"><strong>Hypothyroidism</strong>: Fatigue, weight gain, depression, cold intolerance, dry skin</div>
                    <div className="education-list-item"><strong>Hyperthyroidism</strong>: Anxiety, weight loss, heat intolerance, palpitations, tremors</div>
                    <div className="education-list-item"><strong>Thyroid Nodules</strong>: 50% of adults have nodules, with 5-15% being cancerous</div>
                    <div className="education-list-item"><strong>Postpartum Thyroiditis</strong>: Affects 5-10% of women after delivery</div>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Accordion className="faq-accordion">
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" color='black'>Who is at risk for thyroid disorders?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color='textSecondary'>
                Risk factors include: Female gender (5-8x higher risk), age over 60, family history of thyroid disease, 
                autoimmune conditions (Type 1 diabetes, rheumatoid arthritis), previous thyroid surgery or radiation, 
                iodine deficiency or excess, and certain medications (lithium, amiodarone).
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <Container maxWidth="xl">
          <Typography variant="h3" className="section-title" align="center">
            Our Comprehensive Thyroid Management Features
          </Typography>
          
          <Grid container spacing={4} className="features-grid">
            <Grid item xs={12} md={6} lg={4}>
              <Card className="feature-card">
                <CardContent>
                  <img src={pregnancyRisk} alt="Pregnancy risk assessment" className="feature-image" />
                  <Typography variant="h5" className="feature-title">
                    Pregnancy Thyroid Management
                  </Typography>
                  <Typography variant="body1" className="feature-description">
                    Specialized care for pregnancy with thyroid conditions:
                  </Typography>
                  <div className="feature-points">
                    <div className="feature-point">Trimester-specific TSH targets (1st: 0.1-2.5, 2nd: 0.2-3.0, 3rd: 0.3-3.0 mIU/L)</div>
                    <div className="feature-point">Medication dose adjustment algorithms</div>
                    <div className="feature-point">Postpartum thyroiditis risk scoring</div>
                    <div className="feature-point">Fetal development monitoring</div>
                  </div>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Card className="feature-card">
                <CardContent>
                  <img src={thyroidAssessment} alt="Long term assessment" className="feature-image" />
                  <Typography variant="h5" className="feature-title">
                    Comprehensive Thyroid Analytics
                  </Typography>
                  <Typography variant="body1" className="feature-description">
                    Advanced tracking and prediction:
                  </Typography>
                  <div className="feature-points">
                    <div className="feature-point">Personalized TSH trajectories based on your history</div>
                    <div className="feature-point">Medication response curves</div>
                    <div className="feature-point">Risk prediction for developing complications</div>
                    <div className="feature-point">Integration with wearable device data</div>
                  </div>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Card className="feature-card">
                <CardContent>
                  <img src={nodulesAnalysis} alt="Nodules analysis" className="feature-image" />
                  <Typography variant="h5" className="feature-title">
                    Nodule Risk Stratification
                  </Typography>
                  <Typography variant="body1" className="feature-description">
                    Evidence-based nodule evaluation:
                  </Typography>
                  <div className="feature-points">
                    <div className="feature-point">TIRADS scoring for ultrasound findings</div>
                    <div className="feature-point">Growth rate monitoring algorithms</div>
                    <div className="feature-point">Molecular marker interpretation</div>
                    <div className="feature-point">Biopsy recommendation engine</div>
                  </div>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Card className="feature-card">
                <CardContent>
                  <img src={dietTracking} alt="Diet tracking" className="feature-image" />
                  <Typography variant="h5" className="feature-title">
                    Nutritional Optimization
                  </Typography>
                  <Typography variant="body1" className="feature-description">
                    Personalized dietary guidance:
                  </Typography>
                  <div className="feature-points">
                    <div className="feature-point">Condition-specific meal plans (Hashimoto's vs Graves')</div>
                    <div className="feature-point">Nutrient timing around medication</div>
                    <div className="feature-point">Goitrogen content analyzer</div>
                    <div className="feature-point">Supplement interaction checker</div>
                  </div>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Card className="feature-card">
                <CardContent>
                  <img src={labReport} alt="Lab report analysis" className="feature-image" />
                  <Typography variant="h5" className="feature-title">
                    Lab Report Interpretation
                  </Typography>
                  <Typography variant="body1" className="feature-description">
                    Advanced test analysis:
                  </Typography>
                  <div className="feature-points">
                    <div className="feature-point">Pattern recognition across multiple tests</div>
                    <div className="feature-point">Central vs peripheral resistance detection</div>
                    <div className="feature-point">Subclinical transition prediction</div>
                    <div className="feature-point">Personalized reference ranges</div>
                  </div>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Card className="feature-card">
                <CardContent>
                  <img src={medication} alt="Medication management" className="feature-image" />
                  <Typography variant="h5" className="feature-title">
                    Medication Optimization
                  </Typography>
                  <Typography variant="body1" className="feature-description">
                    Precision dosing tools:
                  </Typography>
                  <div className="feature-points">
                    <div className="feature-point">Levothyroxine absorption factors</div>
                    <div className="feature-point">Brand-specific equivalency calculator</div>
                    <div className="feature-point">Dose timing recommendations</div>
                    <div className="feature-point">Combination therapy algorithms</div>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <Container maxWidth="md">
          <Typography variant="h3" className="cta-title" align="center">
            Begin Your Personalized Thyroid Journey
          </Typography>
          <Typography variant="subtitle1" className="cta-subtitle" align="center">
            Our platform combines medical expertise with advanced technology to deliver precision thyroid care.
          </Typography>
          <Box className="cta-actions" justifyContent="center">
            <Button 
              variant="contained" 
              size="large" 
              className="primary-button"
              onClick={() => navigate('/signup')}
            >
              Start Now
            </Button>
          </Box>
        </Container>
      </section>
    </div>
  );
};

export default LandingPage;