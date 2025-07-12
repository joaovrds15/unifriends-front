import React from 'react';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import ProfilePage from './components/ProfilePage';
import AffinityScreen from './components/AffinityScreen';
import EmailPage from './components/EmailPage';
import AffinityQuiz from './components/AffinityQuiz';
import VerificationCodePage from './components/VerificationCodePage';
import UploadImagesPage from './components/UploadImagesPage';
import ConnectionRequests from './components/ConnectionRequests';
import PrivateRoute from './components/PrivateRoute';
import { UserProvider } from './context/UserContext';

function App() {
  const [emailVerified, setEmailVerified] = useState(false);

  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup/email" element={<EmailPage />} />
          <Route path="/signup/verification" element={<VerificationCodePage />} />
          <Route 
            path="/signup" 
            element={<SignUpPage setEmailVerified={setEmailVerified} />}
          />
          <Route path="/upload-images" element={<UploadImagesPage />} />
          
          {/* Private routes - require authentication */}
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/affinity-quiz" 
            element={
              <PrivateRoute>
                <AffinityQuiz />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/affinity" 
            element={
              <PrivateRoute>
                <AffinityScreen />
              </PrivateRoute>
            } 
          />
          <Route
            path="/connection-requests"
            element={
              <PrivateRoute>
                <ConnectionRequests />
              </PrivateRoute>
            } 
          />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;