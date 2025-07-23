import React, { useState, useContext, useEffect, useCallback } from 'react';
import logoImage from '../icons/image.png';
import { HttpStatusCode } from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { RegistrationContext } from '../context/RegistrationContext';
import { getVerificationCodeExpiration, sendVerificationCode, submitVerificationEmail } from '../services/registrationService';

const VerificationCodePage = () => {
  const navigate = useNavigate();

  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const { registrationData } = useContext(RegistrationContext);
  const { email } = registrationData;

  const getExpirationTime = useCallback(async () => {
    try {
      const response = await getVerificationCodeExpiration(registrationData.email);
      return response.data.expiration_time
    } catch (error) {
      return 0;
    }
  }, [email]);

  useEffect(() => {
    const fetchExpirationTime = async () => {
      const expirationTime = await getExpirationTime();
      setTimer(expirationTime);
    };

    fetchExpirationTime();
  }, [getExpirationTime]);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendVerificationCode(email, code);
      navigate('/signup');
    } catch (error) {
      if (error.response.status == HttpStatusCode.Unauthorized)
        setErrorMessage('Código de verificação inválido');
        return;
      }
      setErrorMessage('Algo deu errado. Tente novamente mais tarde.');
  };

  const handleResendCode = async () => {
    try {
      const response = await submitVerificationEmail(email)
      setErrorMessage('');
      setTimer(response.data.expiration_time);
    } catch (error) {
        setTimer(0);
        setErrorMessage('Failed to resend verification code');
    }
  };

  return (
  <div className="flex flex-col items-center justify-center min-h-screen bg-white font-sans">
    <img src={logoImage} alt="Logo" className="w-24 mb-5" />
    <h2 className="text-2xl font-bold text-gray-800 mb-2">Insira o código de verificação</h2>

    <div className="text-3xl mb-2 font-mono text-gray-700">
      {`${Math.floor(timer / 60)}:${timer % 60 < 10 ? '0' : ''}${timer % 60}`}
    </div>

    <div className="relative w-72 mb-5">
      <input
        type="number"
        placeholder="Código de verificação"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full px-5 py-2 rounded-full border border-green-700 outline-none text-base placeholder-green-700 focus:ring-2 focus:ring-green-500"
      />
    </div>
    {errorMessage && (
      <p className="text-red-600 text-sm text-center mb-2">{errorMessage}</p>
    )}
    <button
      className="w-72 py-2 bg-green-600 text-white rounded-full font-medium text-base hover:bg-green-800 transition mb-2 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
      type="submit"
      onClick={handleVerificationSubmit}
      disabled={timer === 0}
    >
      Verificar e Continuar
    </button>
    <button
      className="w-72 py-2 bg-green-600 text-white rounded-full font-medium text-base hover:bg-green-800 transition disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
      type="button"
      style={{ display: timer === 0 ? 'block' : 'none' }}
      disabled={timer !== 0}
      onClick={handleResendCode}
    >
      Reenviar Código de Verificação
    </button>
  </div>
);
};

export default VerificationCodePage;