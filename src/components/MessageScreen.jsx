import React, { useState, useEffect, useCallback, useRef } from 'react';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getConnections} from '../services/userService';


export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return '';
  
  const messageDate = new Date(timestamp);
  const currentDate = new Date();
  const diffMs = currentDate - messageDate;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    const hours = messageDate.getHours().toString().padStart(2, '0');
    const minutes = messageDate.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  } else if (diffDays === 1) {
    return 'ontem';
  } else if (diffDays < 7) {
    return `${diffDays}d`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? '1sem' : `${weeks}sem`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return months === 1 ? '1m' : `${months}m`;
  } else {
    const years = Math.floor(diffDays / 365);
    return years === 1 ? '1a' : `${years}a`;
  }
};

function MessageScreen() {
  const [connections, setConnections] = useState([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();

  const fetchConnections = useCallback(async () => {
    if (!user?.id) return;
    setError(null);    
    try {
      const response = await getConnections();
      const data = response.data.data;
      if (Array.isArray(data)) setConnections(data);
    } catch (err) {
      setError('Erro ao carregar conexões');
      setConnections([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user?.id) {
        fetchConnections();
    }
  }, [user, fetchConnections]);

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

    if (error && connec.length === 0) {
    return (
      <div className="flex flex-col h-screen max-w-xl bg-white mx-auto">
        <header className="flex justify-between items-center p-4 bg-white">
          <h1 className="text-xl font-bold">Affinity</h1>
        </header>
        <div className="flex flex-col items-center justify-center flex-1">
          <p className="text-red-600 mb-2">{error}</p>
          <button onClick={() => fetchConnections()} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
            Try Again
          </button>
        </div>
        <Footer />
      </div>
    );
  }

return (
    <div className="flex flex-col h-screen max-w-md bg-white mx-auto">
      <div className="flex justify-between items-center p-4 border-b border-gray-200 mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
        <button className="p-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {Array.isArray(connections) && connections.length > 0 ? (
          connections.map((connection, index) => {
            const messagePreview = connection.content
            const messageTime = formatRelativeTime(connection.created);
            const isOnline = connection.is_online || false;

            return (
              <div 
                key={`${connection.user_id}-${index}`} 
                className="flex items-center justify-between bg-gray-50 border border-gray-100  shadow-md shadow-gray-300 rounded-2xl p-4 mb-4"
                onClick={() => navigate(`/messages/${connection.connections.id}`)}
              >
                <div className="relative">
                  <img 
                    src={connection.profile_picture_url || 'default-profile-pic-url.jpg'}
                    alt={connection.name || 'Profile'} 
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-gray-900">{connection.name || 'N/A'}</p>
                    <p className="text-xs text-gray-500">{messageTime}</p>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{messagePreview}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-center text-gray-600 my-4">Você ainda não tem nenhuma conexão</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default MessageScreen;