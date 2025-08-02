import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../icons/image.png';
import { RegistrationContext } from '../context/RegistrationContext';
import { submitVerificationEmail } from '../services/registrationService';

const EmailPage = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const { registrationData, setRegistrationData } = useContext(RegistrationContext);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
      try {
        await submitVerificationEmail(registrationData.email);
        navigate('/signup/verification');
      } catch (error) {
        setErrorMessage('Algo deu errado. Tente novamente mais tarde.');
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