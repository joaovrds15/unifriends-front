import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import ProfilePage from './components/ProfilePage';
import EmailPage from './components/EmailPage';
import VerificationCodePage from './components/VerificationCodePage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/signup/email" element={<EmailPage />} />
        <Route path="/signup/verification" element={<VerificationCodePage />} />
      </Routes>
    </Router>
  );
}

export default App;