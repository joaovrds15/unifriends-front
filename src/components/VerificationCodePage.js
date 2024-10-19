import React, { useState } from 'react';
import logoImage from '../icons/image.png';
import '../components/components_css/VerificationCodePage.css';

const VerificationCodePage = ({ formData, handleSubmit }) => {
  const [code, setCode] = useState('');

  const handleVerificationSubmit = (e) => {
    e.preventDefault();
    handleSubmit({ ...formData, code });
  };

  return (
    <div className="verification-page-container">
        <img src={logoImage} alt="Logo" className="logo" />
      <h2>Insira o código de verificação</h2>
      <div className='input-container'>
        <input
          type="text"
          placeholder="Código de verificação"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        </div>
        <button className='continue-button' type="submit">Verificar e Continuar</button>
    </div>
  );
};

export default VerificationCodePage;