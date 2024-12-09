import React, { useState, useContext, useEffect, useCallback } from 'react';
import logoImage from '../icons/image.png';
import { useNavigate} from 'react-router-dom';
import '../components/components_css/VerificationCodePage.css';
import { RegistrationContext } from '../context/RegistrationContext';

const VerificationCodePage = () => {
  const navigate = useNavigate();

  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const { registrationData } = useContext(RegistrationContext);
  const { email } = registrationData;

  const getExpirationTime = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8090/api/verify/code/${email}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      return response.ok ? data.expiration_time : 0;
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
      const response = await fetch('http://localhost:8090/api/verify/email', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          verification_code: Number(code),
        }),
      });

      if (response.status === 401) {
        setErrorMessage('Código de verificação inválido');
        return;
      }
      navigate('/signup');
    } catch (error) {
      setErrorMessage('Algo deu errado. Tente novamente mais tarde.');
    }
  };

  const handleResendCode = async () => {
    try {
      const response = await fetch(`http://localhost:8090/api/verify/email/${email}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setErrorMessage('');
      const data = await response.json();
      if (!response.ok) {
        throw new Error('Failed to resend verification code');
      }
      setTimer(data.expiration_time);
    } catch (error) {
        setTimer(0);
        setErrorMessage('Algo deu errado. Tente novamente mais tarde.');
    }
  };

  return (
    <div className="verification-page-container">
      <img src={logoImage} alt="Logo" className="logo" />
      <h2>Insira o código de verificação</h2>

      <div className="timer">
        {`${Math.floor(timer / 60)}:${timer % 60 < 10 ? '0' : ''}${timer % 60}`}
      </div>

      <div className='input-container'>
        <input
          type="number"
          placeholder="Código de verificação"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>
      {errorMessage && (
        <p className='error-message'>{errorMessage}</p>
      )}
      <button
        className='continue-button'
        type="submit"
        onClick={handleVerificationSubmit}
        disabled={timer === 0}
      >
        Verificar e Continuar
      </button>
      <button
        className='resend-button'
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