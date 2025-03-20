import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/components_css/EmailPage.css';
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
      const response = await fetch('http://localhost:8090/api/verify/email/' + email, {
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
    <div className="email-page-container">
      <img src={logoImage} alt="Logo" className="logo" />
      <h2 id='email-title'>Insira seu E-mail IFG</h2>
      <p>@estudantes.ifg.edu.br</p>
      <div className='input-container'>
        <input
          type="email"
          placeholder="E-mail"
          value={registrationData.email}
          onChange={(e) => setRegistrationData({ ...registrationData, email: e.target.value })}
        />
      </div>
      {errorMessage && (
        <p className='error-message'>{errorMessage}</p>
      )}
      <button className="signup-button" type="submit" onClick={handleEmailSubmit}>Continuar</button>
    </div>
  );
};

export default EmailPage;