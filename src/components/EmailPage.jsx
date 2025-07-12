import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../icons/image.png';
import { RegistrationContext } from '../context/RegistrationContext';

const EmailPage = () => {
  const CREATED = 201;
  const OK = 200;
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const { registrationData, setRegistrationData } = useContext(RegistrationContext);

  const sendVerificationEmail = async (email) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/verify/email/` + email, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.status === CREATED || response.status === OK) {
        return data;
      }
      setErrorMessage(data.error || 'Algo deu errado. Tente novamente mais tarde.');
    } catch (error) {
      setErrorMessage('Algo deu errado. Tente novamente mais tarde.');
    }
  };
  
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (registrationData.email.endsWith('@estudantes.ifg.edu.br')) {
      try {
        const data = await sendVerificationEmail(registrationData.email);
        if (data) {
          navigate('/signup/verification');
        }
      } catch (error) {
        setErrorMessage('Algo deu errado. Tente novamente mais tarde.');
      }
    } else {
      setErrorMessage('Insira um e-mail IFG válido');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white font-sans">
      <img src={logoImage} alt="Logo" className="w-24 mb-5" />
      <h2 id="email-title" className="text-2xl font-bold text-gray-800 mb-2">Insira seu E-mail IFG</h2>
      <p className="text-gray-600 mb-4">@estudantes.ifg.edu.br</p>
      <div className="relative w-72 mb-5">
        <input
          type="email"
          placeholder="E-mail"
          value={registrationData.email}
          onChange={(e) => setRegistrationData({ ...registrationData, email: e.target.value })}
          className="w-full px-5 py-2 rounded-full border border-green-700 outline-none text-base placeholder-green-700 focus:ring-2 focus:ring-green-500"
        />
      </div>
      {errorMessage && (
        <p className="text-red-600 text-sm text-center mb-2">{errorMessage}</p>
      )}
      <button
        className="w-72 py-2 bg-green-600 text-white rounded-full font-medium text-base hover:bg-green-800 transition mb-2"
        type="submit"
        onClick={handleEmailSubmit}
      >
        Continuar
      </button>
    </div>
  );
};

export default EmailPage;