import React, { useState, useEffect, useCallback, useRef } from 'react';
import Footer from './Footer';
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
  const { user } = useUser();

  const fetchProfiles = useCallback(async (page = 1, append = false) => {
    if (!user?.id) return;

    if (page === 1) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    setError(null);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/get-results/user/${user.id}?page=${page}&limit=10`, {
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
  }, [user]);

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

  const sendConnectionRequest = async (userId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/connections/request/user/${userId}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response;
    } catch (error) {
      setError('Algo deu errado. Tente novamente mais tarde.');
    }
  };

const handleConnectSubmit = async (userId) => {
    if (error) {
      return;
    }

    try {
      const response = await sendConnectionRequest(userId);
      if (response && response.status === 201) {
        const data = await response.json();
        setProfiles(prevProfiles =>
          prevProfiles.map(profile =>
            profile.user_id === userId
              ? {
                  ...profile,
                  has_pending_connection_request: true,
                  connection_request: data.data,
                }
              : profile
          )
        );
      }
    } catch (error) {
      setError('Algo deu errado. Tente novamente mais tarde.');
    }
  };

  useEffect(() => {
    if (user?.id) {
        fetchProfiles(1, false);
    }
  }, [user, fetchProfiles]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen max-w-xl bg-white mx-auto">
        <header className="flex justify-between items-center p-4 bg-white">
        </header>
        <div className="flex flex-col items-center justify-center flex-1">
          <div className="border-4 border-blue-200 border-t-blue-500 rounded-full w-8 h-8 animate-spin mb-2"></div>
          <p className="text-gray-600">Loading profiles...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error && profiles.length === 0) {
    return (
      <div className="flex flex-col h-screen max-w-xl bg-white mx-auto">
        <header className="flex justify-between items-center p-4 bg-white">
          <h1 className="text-xl font-bold">Affinity</h1>
        </header>
        <div className="flex flex-col items-center justify-center flex-1">
          <p className="text-red-600 mb-2">Error loading profiles: {error}</p>
          <button onClick={() => fetchProfiles(1, false)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
            Try Again
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-w-md bg-white mx-auto">
      <Header />
      <div className="flex-1 overflow-y-auto p-5">
        {Array.isArray(profiles) && profiles.length > 0 ? (
          profiles.map((profile, index) => {
            const isLast = profiles.length === index + 1;
            return (
              <div 
              key={`${profile.user_id}-${index}`} 
              className="flex items-center justify-between bg-gray-50 border border-gray-300  shadow-md shadow-gray-300 rounded-2xl p-4 mb-4"
              ref={isLast ? lastProfileElementRef : null}
              >
              <img 
                src={profile.profile_picture_url || 'default-profile-pic-url.jpg'}
                alt={profile.name || 'Profile'} 
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1 ml-4">
                <p className="text-base font-bold">{profile.name || 'N/A'}</p>
                <p className="text-gray-500 text-sm">Pontuação: {profile.score !== undefined ? profile.score : 'N/A'}</p>
              </div>
              <div className='flex flex-col space-y-2 w-22'>
                <button className="bg-green-600 text-sm text-white px-2 py-2 rounded-lg hover:bg-green-800 transition w-full" onClick={() => navigate(`/profile/${profile.user_id}`)}>Perfil</button>
                {profile.has_pending_connection_request && profile.connection_request.requesting_user_id == user.id ? (
                  <button
                    className="bg-gray-300 text-sm text-gray-600 px-4 py-2 rounded-lg w-full cursor-not-allowed"
                    disabled
                  >
                    Solicitação enviada
                  </button>
                ) : profile.has_connection ? (
                  <button className="bg-green-600 text-sm text-white px-2 py-2 rounded-lg hover:bg-green-800 transition w-full" onClick={() => navigate(`/profile/${profile.user_id}`)}>Mensagens</button>
                ) : profile.has_pending_connection_request && profile.connection_request.requesting_user_id != user.id ? (
                  <button disabled className="bg-gray-300 text-sm text-gray-600 px-4 py-2 rounded-lg w-full cursor-not-allowed" onClick={() => navigate(`/profile/${profile.user_id}`)}>Aprovação pendente</button>
                ) : (
                  <button
                    className="bg-blue-500 text-sm text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition w-full"
                    onClick={() => handleConnectSubmit(profile.user_id)}
                  >
                    Conectar
                  </button>
                )}
              </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-600">Não foram encontrados resultados. Já respondeu o questionário?</p>
        )}
        
        {isLoadingMore && (
          <div className="flex flex-col items-center py-5 text-gray-600">
            <div className="border-4 border-blue-200 border-t-blue-500 rounded-full w-8 h-8 animate-spin mb-2"></div>
            <p className="text-sm">Loading more profiles...</p>
          </div>
        )}
        
        {!hasMore && profiles.length > 0 && (
          <div className="text-center py-5 text-gray-400 italic">
            <p>You've reached the end of the results!</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default AffinityScreen;