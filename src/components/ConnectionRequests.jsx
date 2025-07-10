import React, { useState, useEffect, useCallback } from 'react';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Header from './Header';

function ConnectionRequests() {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();

  const fetchConnectionRequests = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/connections/requests`, {
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
        setRequests(data.data);
      } else {
        console.error('API response for requests is not an array:', data.data);
        setError('Received invalid data format for requests.');
      }
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError(err.message);
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user?.id) {
        fetchConnectionRequests();
    }
  }, [user, fetchConnectionRequests]);

  const sendRequestAnswer = async (requestId, action) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/connections/requests/${requestId}/${action}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    } catch (error) {
      setError('Algo deu errado. Tente novamente mais tarde.');
      throw error;
    }
  };

  const handleRequestAnswer = async (requestId, action) => {
    if (error) {
      setError(null);
    }

    try {
      const response = await sendRequestAnswer(requestId, action);
      if (response && response.ok){
        setRequests(prevRequests =>
          prevRequests.filter(request => request.id !== requestId)
        );
      } else {
        setError('Falha ao processar a solicitação.');
      }
    } catch (error) {
      setError('Algo deu errado. Tente novamente mais tarde.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen max-w-xl bg-white mx-auto">
        <header className="flex justify-between items-center p-4 bg-white">
        </header>
        <div className="flex flex-col items-center justify-center flex-1">
          <div className="border-4 border-blue-200 border-t-blue-500 rounded-full w-8 h-8 animate-spin mb-2"></div>
          <p className="text-gray-600">Loading requests...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error && requests.length === 0) {
    return (
      <div className="flex flex-col h-screen max-w-xl bg-white mx-auto">
        <header className="flex justify-between items-center p-4 bg-white">
          <h1 className="text-xl font-bold">Affinity</h1>
        </header>
        <div className="flex flex-col items-center justify-center flex-1">
          <p className="text-red-600 mb-2">Erro ao carregar requisições</p>
          <button onClick={() => fetchConnectionRequests()} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
            Tentar novamente
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
        {Array.isArray(requests) && requests.length > 0 ? (
          requests.map((request, index) => {
            return (
              <div 
              key={`${request.requesting_user.user_id}-${index}`} 
              className="flex items-center justify-between bg-gray-50 border border-gray-300  shadow-md shadow-gray-300 rounded-2xl p-4 mb-4"
              >
              <img
                src={request.requesting_user.profile_picture_url || 'default-profile-pic-url.jpg'}
                alt={request.requesting_user.name || 'Profile'} 
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1 ml-4">
                <p className="text-base font-bold">{request.requesting_user.name || 'N/A'}</p>
              </div>
              <div className='flex flex-col space-y-2 w-22'>
                <button className="bg-green-600 text-sm text-white px-4 py-2 rounded-lg hover:bg-green-800 transition w-full" onClick={() => handleRequestAnswer(request.id, 'accept')}>Aceitar</button>
                <button className="bg-red-600 text-sm text-white px-4 py-2 rounded-lg hover:bg-red-800 transition w-full" onClick={() => handleRequestAnswer(request.id, 'reject')}>Rejeitar</button>
              </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-600">Não foram encontrados solicitações</p>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default ConnectionRequests;