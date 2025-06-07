import React, { useState, useEffect } from 'react';
import Footer from './Footer';
import '../components/components_css/AffinityScreen.css';

function AffinityScreen() {
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/get-results/user/53`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data.data)) {
          setProfiles(data.data);
        } else {
          console.error('API response for profiles is not an array:', data.data);
          setProfiles([]);
          setError('Received invalid data format for profiles.');
        }
      } catch (err) {
        console.error('Error fetching profiles:', err);
        setError(err.message);
        setProfiles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  if (isLoading) {
    return (
      <div className="container">
        <header className="header">
          <h1>Affinity</h1>
        </header>
        <div className="message-container">
          <p>Loading profiles...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <header className="header">
          <h1>Affinity</h1>
        </header>
        <div className="message-container">
          <p>Error loading profiles: {error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Affinity</h1>
        <button className="logout-button">Log Out</button>
      </header>
      <div className="profile-list">
        {Array.isArray(profiles) && profiles.length > 0 ? (
          profiles.map((profile) => (
            <div key={profile.id} className="profile-card">
              <img 
                src={profile.profile_picture_url || 'default-profile-pic-url.jpg'}
                alt={profile.name || 'Profile'} 
                className="profile-image" 
              />
              <div className="profile-info">
                <h2 className='profile-name'>{profile.name || 'N/A'}</h2>
                <p>Ranking Score: {profile.score !== undefined ? profile.score : 'N/A'}</p>
              </div>
              <button className="view-profile-button">View Profile</button>
            </div>
          ))
        ) : (
          !isLoading && <p className="message-container">Não foram encontrados resultados. Já respondeu o questionário?</p>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default AffinityScreen;