import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { jsPDF } from 'jspdf';
import LOGO_BASE64 from './logoBase64';
// Replace this with your actual base64 encoded logo or remove if not needed


const ClinicalAdviceHistory = () => {
  const [currentAdvice, setCurrentAdvice] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState({
    current: true,
    history: true
  });
  const [error, setError] = useState({
    current: null,
    history: null
  });

  const patientID = localStorage.getItem('patient_id');

  useEffect(() => {
    if (!patientID) {
      setError({
        current: 'Patient ID not found. Please login again.',
        history: 'Patient ID not found. Please login again.'
      });
      setLoading({
        current: false,
        history: false
      });
      return;
    }

    const fetchCurrentAdvice = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/advice/get_clinical_advice?patient_id=${patientID}`
        );
        if (!response.ok) throw new Error(`Failed to fetch current advice: ${response.status}`);
        
        const data = await response.json();
        if (data.clinical_advice) {
          setCurrentAdvice({
            advice: data.clinical_advice,
            date: new Date().toISOString()
          });
        } else {
          setError(prev => ({ ...prev, current: 'No current advice available' }));
        }
      } catch (err) {
        setError(prev => ({ ...prev, current: err.message }));
      } finally {
        setLoading(prev => ({ ...prev, current: false }));
      }
    };

    const fetchAdviceHistory = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/advice/get_patient_history?patient_id=${patientID}`
        );
        if (!response.ok) throw new Error(`Failed to fetch history: ${response.status}`);
        
        const data = await response.json();
        
        if (data.message && data.message.includes("No history found")) {
          setHistory([]);
        } else if (data.clinical_advices) {
          const sortedHistory = data.clinical_advices
            .map(item => ({
              ...item,
              category_description: item.CategoryDescription,
              clinical_advice: item.ClinicalAdvice || item.clinical_advice,
              predicted_category: item.PredictedCategory,
              date: item.sysdate
            }))
            .filter(item => item.date)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
          
          setHistory(sortedHistory);
        } else {
          setHistory([]);
        }
      } catch (err) {
        console.error('History fetch error:', err);
        setError(prev => ({ ...prev, history: err.message }));
      } finally {
        setLoading(prev => ({ ...prev, history: false }));
      }
    };

    fetchCurrentAdvice();
    fetchAdviceHistory();
  }, [patientID]);

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Date not available';
    try {
      const date = new Date(dateString);
      const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      };
      return date.toLocaleString(undefined, options);
    } catch (e) {
      console.error('Error formatting date:', dateString, e);
      return dateString;
    }
  };

  const formatTextWithLineBreaks = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => (
      <Typography key={i} paragraph sx={{ marginBottom: 1, color: 'black' }}>
        {line}
      </Typography>
    ));
  };

  const handleDownloadPDF = () => {
  if (!currentAdvice?.advice) return;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 15; // Slightly reduced from 14
  const maxWidth = pageWidth - (margin * 2);
  const lineHeight = 7;
  
  // Add logo and header
  if (LOGO_BASE64) {
    try {
      doc.addImage(LOGO_BASE64, 'PNG', margin, 10, 30, 15);
    } catch (e) {
      console.error('Error adding logo:', e);
    }
  }
  
  // Header text - moved closer to right edge
  doc.setFontSize(18);
  doc.setTextColor(40, 53, 147);
  doc.text("ThyroPulse", margin + 35, 20);
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text("Personalized Thyroid Care Report", margin + 35, 27);

  // Patient info - moved to use more space
  doc.setFontSize(10);
  doc.setTextColor(80);
  doc.text(`Patient ID: ${patientID || 'N/A'}`, pageWidth - margin - 70, 20);
  doc.text(`Generated: ${formatDateTime(new Date())}`, pageWidth - margin - 70, 27);

  // Title - centered with full width
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text("Clinical Recommendations", pageWidth / 2, 45, { align: 'center' });

  // Divider - full width
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, 50, pageWidth - margin, 50);

  // Process advice text with wider text area
  const adviceText = currentAdvice.advice;
  const splitText = doc.splitTextToSize(adviceText, maxWidth + 20); // Increased width
  
  let yPos = 60;
  const pageHeight = doc.internal.pageSize.height;
  
  // Add content with optimized spacing
  splitText.forEach((line, index) => {
    if (yPos > pageHeight - 30) {
      doc.addPage();
      yPos = 20;
      // Add header to new page
      doc.setFontSize(10);
      doc.setTextColor(80);
      doc.text(`ThyroPulse - Clinical Recommendations (Cont.)`, margin, 10);
      doc.text(`Page ${doc.internal.getNumberOfPages()}`, pageWidth - margin, 10, { align: 'right' });
      yPos = 20;
    }
    
    // Use slightly larger font when we have more space
    doc.setFontSize(12.5); // Increased from 12
    doc.setTextColor(0, 0, 0);
    doc.text(line, margin - 2, yPos); // Slight left adjustment
    yPos += lineHeight;
  });

  // Add footer with full width
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100);
    
    // Full width footer divider
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, pageHeight - 25, pageWidth - margin, pageHeight - 25);
    
    // Disclaimer text with full width
    doc.text("Disclaimer: This report is generated by ThyroPulse for informational purposes only.", 
      margin, pageHeight - 20);
    doc.text("It is not a substitute for professional medical advice, diagnosis, or treatment.", 
      margin, pageHeight - 15);
    doc.text("Always consult your healthcare provider for medical questions or concerns.", 
      margin, pageHeight - 10);
  }

  doc.save(`ThyroPulse_Recommendations_${patientID || ''}_${new Date().toISOString().slice(0, 10)}.pdf`);
};

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 20 }}>
      <Typography variant="h4" color='Black' gutterBottom>
        Your Thyroid Care Recommendations
      </Typography>

      {loading.current && (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      )}

      {error.current && !currentAdvice && (
        <Box mt={2}>
          <Alert severity="error">{error.current}</Alert>
        </Box>
      )}

      {currentAdvice && !loading.current && (
        <Box mb={4}>
          <Typography variant="h6" color="primary" gutterBottom>
            Latest Recommendations
          </Typography>
          <Card elevation={3} style={{ 
            marginBottom: 30,
            borderLeft: '4px solid #3f51b5',
            backgroundColor: '#f8f9fa'
          }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle2" color="textSecondary">
                  {formatDateTime(currentAdvice.date)}
                </Typography>
                <Chip label="Current" color="primary" size="small" />
              </Box>
              <Divider sx={{ my: 2 }} />
              {formatTextWithLineBreaks(currentAdvice.advice)}

              <Button
                variant="outlined"
                color="primary"
                onClick={handleDownloadPDF}
                sx={{ mt: 2 }}
              >
                Download Advice as PDF
              </Button>
            </CardContent>
          </Card>
        </Box>
      )}

      {loading.history && (
        <Box display="flex" justifyContent="center" my={2}>
          <CircularProgress size={24} />
        </Box>
      )}

      {error.history && (
        <Box mb={2}>
          <Alert severity="warning">{error.history}</Alert>
        </Box>
      )}

      {history.length > 0 && !loading.history && (
        <Box>
          <Typography variant="h6" color="primary" gutterBottom>
            Previous Recommendations
          </Typography>
          {history.map((item, index) => (
            <Accordion key={index} style={{ 
              marginBottom: 12,
              borderRadius: '8px',
              transition: 'box-shadow 0.3s ease'
            }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box width="100%" display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography sx={{ color: 'black', fontWeight: 500 }}>
                      {formatDateTime(item.date)}
                    </Typography>
                  </Box>
                  <Chip label={item.predicted_category} size="small" />
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ color: 'black' }}>
                {formatTextWithLineBreaks(item.clinical_advice)}
                {item.category_description && (
                  <Box mt={2}>
                    <Typography variant="subtitle2">Category Details:</Typography>
                    <Typography variant="body2">{item.category_description}</Typography>
                  </Box>
                )}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}

      {!loading.history && history.length === 0 && !error.history && (
        <Box mt={2}>
          <Alert severity="info">No previous recommendations found</Alert>
        </Box>
      )}
    </div>
  );
};

export default ClinicalAdviceHistory;