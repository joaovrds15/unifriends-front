import React, { useState, useEffect } from 'react';
import Footer from './Footer';
import '../components/components_css/AffinityScreen.css';

function AffinityScreen() {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch('http://localhost:8090/api/get-results/user/51', {
          method: 'GET',
          credentials: 'include',
          headers: {
              'Content-Type': 'application/json',
          },
      });
        const data = await response.json();
        setProfiles(data.data);
      } catch (error) {
        console.error('Error fetching profiles:', error);
      }
    };

    fetchProfiles();
  }, []);

  return (
    <div className="container">
      <header className="header">
        <h1>Affinity</h1>
        <button className="logout-button">Log Out</button>
      </header>
      <div className="profile-list">
        {profiles.map((profile) => (
          <div key={profile.id} className="profile-card">
            <img src={profile.profile_picture_url} alt={profile.name} className="profile-image" />
            <div className="profile-info">
              <h2>{profile.name}</h2>
              <p>Ranking Score: {profile.score}</p>
            </div>
            <button className="view-profile-button">View Profile</button>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default AffinityScreen;