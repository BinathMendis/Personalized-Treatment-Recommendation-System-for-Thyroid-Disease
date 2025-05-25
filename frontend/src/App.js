import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TrackHealth from './component/TrackHealth';
import FoodRecommendations from './component/FoodRecommendations';
import ClinicalAdvice from './component/ClinicalAdvice';
import Signup from './component/Signup';
import Login from './component/Login';
import VerifyOTP from './component/VerifyOTP';
import ForgotPassword from './component/ForgotPassword';
import ResetPassword from './component/ResetPassword';
import Logout from "./component/Logout";
import Dashboard from './component/Dashboard';
import Navbar from './component/Navbar';
import Profile from "./component/Profile";  
import Pregnancy from "./component/Pregnancy";
import RiskPage from "./component/RiskPage";
import NoRiskPage from "./component/NoRiskPage";
import PregnancyRiskTool from './component/PregnancyRiskTool';
import Footer from './component/footer';
import InputForm from './component/VishakRisk/InputForm';
import FileUpload from './component/VishakRisk/FileUpload';
import Results from './component/VishakRisk/Results';
import RiskAss from './component/VishakRisk/RisakAss';
import LandingPage from './component/TrendsDashboard';


function App() {
  return (
    <Router>
      <div className="App" style={{ width: '100%' }}>
        <Navbar /> {/* Always visible navbar with icon-triggered drawer */}
        {/* Padding top equals the AppBar height to avoid overlap */}
        <div style={{ paddingTop: '64px', width: '100%' }}>
          <Routes>
            <Route path="/track-health" element={<TrackHealth />} />
            <Route path="/food-recommendations" element={<FoodRecommendations />} />
            <Route path="/clinical-advice" element={<ClinicalAdvice />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/predict" element={<Pregnancy />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/risk/high" element={<RiskPage />} />
            <Route path="/risk/low" element={<NoRiskPage />} />
            <Route path="/pregnancy-risk-tool" element={<PregnancyRiskTool />} />
            <Route path="/input-form" element={<InputForm />} />
            <Route path="/file-upload" element={<FileUpload />} />
            <Route path="/results" element={<Results />} />
            <Route path="/risk-ass" element={<RiskAss />} />
            <Route path="/LandingPage" element={<LandingPage />} />

          </Routes>
           <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
