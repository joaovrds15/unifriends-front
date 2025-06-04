import React, { useState, useEffect, useContext } from 'react';
import '../components/components_css/SignUpPage.css';
import logoImage from '../icons/image.png';
import InputMask from 'react-input-mask';
import { useNavigate } from 'react-router-dom';
import { RegistrationContext } from '../context/RegistrationContext';
import showIcon from '../icons/show.svg';
import hideIcon from '../icons/hide.svg';

const SignUpPage = ({setEmailVerified}) => {
  const [majors, setMajors] = useState([]);
  const { registrationData, setRegistrationData } = useContext(RegistrationContext);
  const [passwordError, setPasswordError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rePasswordVisible, setRePasswordVisible] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setEmailVerified(true);
  }, [setEmailVerified]);

  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/majors`,{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setMajors(data.majors);
      } catch (error) {
        console.error('Error fetching majors:', error);
      }
    };

    fetchMajors();
  }, []);

  useEffect(() => {
    const savedData = localStorage.getItem('registrationData');
    if (savedData) {
      setRegistrationData(JSON.parse(savedData));
    }
  }, [setRegistrationData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...registrationData, [name]: value };

    setRegistrationData(updatedData);

    const { password, rePassword, ...dataToSave } = updatedData;
    localStorage.setItem('registrationData', JSON.stringify(dataToSave));
  };

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    const updatedData = { ...registrationData, rePassword: value };
    setRegistrationData(updatedData);
    if (registrationData.password !== value) {
      setPasswordError('Senhas diferentes');
    } else {
      setPasswordError('');
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleRePasswordVisibility = () => {
    setRePasswordVisible(!rePasswordVisible)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwordError) {
      return;
    }
    navigate('/upload-images');
  };

  return (
    <form className="signup-container" onSubmit={handleSubmit}>
      <img src={logoImage} alt="Logo" className="logo" />
      <h2>Cadastro</h2>

      <div className="input-container">
        <input
          type="text"
          placeholder="Nome"
          name="firstName"
          value={registrationData.firstName}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Sobrenome"
          name="lastName"
          value={registrationData.lastName}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="input-container">
        <InputMask
          mask="(99) 99999-9999"
          value={registrationData.phoneNumber}
          onChange={(e) => handleInputChange({ target: { name: 'phoneNumber', value: e.target.value } })}
          placeholder="Telefone"
          required
        >
          {(inputProps) => <input {...inputProps} type="tel" />}
        </InputMask>
      </div>
      <div className="input-container">
        <select
          className="dropdown"
          name="majorId"
          value={registrationData.majorId}
          onChange={handleInputChange}
          required
        >
          <option value="">Selecione seu curso</option>
          {majors.map((major) => (
            <option key={major.id} value={major.id}>
              {major.name}
            </option>
          ))}
        </select>
      </div>
      <div className="input-container">
        <input
          type={passwordVisible ? "text" : "password"}
          placeholder="Senha"
          name="password"
          value={registrationData.password}
          onChange={handleInputChange}
          required
        />
        <button className="toggle-password" type="button" onClick={togglePasswordVisibility}>
          <img src={passwordVisible ? hideIcon : showIcon} style={{ width: '25px', height: '25px' }} alt={passwordVisible ? 'Hide' : 'Show'} />
        </button>
      </div>
      <div className="input-container">
        <input
          type={rePasswordVisible ? "text" : "password"}
          placeholder="Confirmar senha"
          name="rePassword"
          value={registrationData.rePassword}
          onChange={handlePasswordChange}
          required
        />
        <button className="toggle-password" type="button" onClick={toggleRePasswordVisibility}>
          <img src={rePasswordVisible ? hideIcon : showIcon} style={{ width: '25px', height: '25px' }} alt={passwordVisible ? 'Hide' : 'Show'} />
        </button>
      </div>

      <div className='error-container'>
          {passwordError && <p className="error-text">{passwordError}</p>}
      </div>

      <button className="signup-button" type="submit">Continuar</button>
    </form>
  );
};

export default SignUpPage;