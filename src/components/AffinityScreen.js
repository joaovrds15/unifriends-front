import React, { useState, useEffect, useCallback, useRef } from 'react';
import Footer from './Footer';
import '../components/components_css/AffinityScreen.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Header from './Header';

function AffinityScreen() {
  const [profiles, setProfiles] = useState([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const { user, logoutUser } = useUser();

  const fetchProfiles = useCallback(async (page = 1, append = false) => {
    if (page === 1) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    setError(null);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/get-results/user/${user.id}?page=${page}&limit=10`, {
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
        if (append) {
          setProfiles(prev => [...prev, ...data.data]);
        } else {
          setProfiles(data.data);
        }
        
        setHasMore(data.data.length === 10);
      } else {
        console.error('API response for profiles is not an array:', data.data);
        if (!append) setProfiles([]);
        setError('Received invalid data format for profiles.');
      }
    } catch (err) {
      console.error('Error fetching profiles:', err);
      setError(err.message);
      if (!append) setProfiles([]);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  const lastProfileElementRef = useCallback(node => {
    if (isLoadingMore) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setCurrentPage(prevPage => {
          const nextPage = prevPage + 1;
          fetchProfiles(nextPage, true);
          return nextPage;
        });
      }
    });
    
    if (node) observer.current.observe(node);
  }, [isLoadingMore, hasMore, fetchProfiles]);

  useEffect(() => {
    fetchProfiles(1, false);
  }, [fetchProfiles]);

  if (isLoading) {
    return (
      <div className="container">
        <header className="header">
          <h1>Affinity</h1>
        </header>
        <div className="message-container">
          <div className="loading-spinner"></div>
          <p>Loading profiles...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error && profiles.length === 0) {
    return (
      <div className="container">
        <header className="header">
          <h1>Affinity</h1>
        </header>
        <div className="message-container">
          <p>Error loading profiles: {error}</p>
          <button onClick={() => fetchProfiles(1, false)} className="retry-button">
            Try Again
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="container">
      <Header />
      <div className="profile-list">
        {Array.isArray(profiles) && profiles.length > 0 ? (
          profiles.map((profile, index) => {
            const isLast = profiles.length === index + 1;
            return (
              <div 
                key={`${profile.id}-${index}`} 
                className="profile-card"
                ref={isLast ? lastProfileElementRef : null}
              >
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
            );
          })
        ) : (
          <p className="message-container">Não foram encontrados resultados. Já respondeu o questionário?</p>
        )}
        
        {isLoadingMore && (
          <div className="loading-more-container">
            <div className="loading-spinner"></div>
            <p>Loading more profiles...</p>
          </div>
        )}
        
        {!hasMore && profiles.length > 0 && (
          <div className="end-message">
            <p>You've reached the end of the results!</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default AffinityScreen;