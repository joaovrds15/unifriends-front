import React from 'react';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import ProfilePage from './components/ProfilePage';
import AffinityScreen from './components/AffinityScreen';
import EmailPage from './components/EmailPage';
import VerificationCodePage from './components/VerificationCodePage';
import UploadImagesPage from './components/UploadImagesPage';
import { UserProvider } from './context/UserContext';


function App() {
  const [emailVerified, setEmailVerified] = useState(false);


  return (
    <UserProvider>
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route 
          path="/signup" 
          element={<SignUpPage setEmailVerified={setEmailVerified} />}
        />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/affinity" element={<AffinityScreen />} />
        <Route path="/signup/email" element={<EmailPage />} />
        <Route path="/signup/verification" element={<VerificationCodePage />} />
        <Route path="/upload-images" element={<UploadImagesPage />} />
      </Routes>
    </Router>
    </UserProvider>
  );
}

export default App;