import React from 'react';

import Footer from './Footer';
import '../components/components_css/AffinityScreen.css';

const profiles = await fetch('http://localhost:8090/api/profiles').then((response) => response.json());

function AffinityScreen() {
  return (
    <div className="container">
      <header className="header">
        <h1>Affinity</h1>
        <button className="logout-button">Log Out</button>
      </header>
      <div className="profile-list">
        {profiles.map((profile) => (
          <div key={profile.id} className="profile-card">
            <img src={profile.image} alt={profile.name} className="profile-image" />
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
