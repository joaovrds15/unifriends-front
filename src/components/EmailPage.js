import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/components_css/EmailPage.css';
import logoImage from '../icons/image.png'


const EmailPage = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        if (email.endsWith('@estudantes.ifg.edu.br')) {
            setEmail({ email });
            navigate('/signup/verification');
        } else {
            alert('Insira um e-mail IFG válido');
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

    <button className="signup-button" type="submit" onClick={handleEmailSubmit}>Continuar</button>

    </div>
  );
};

export default EmailPage;