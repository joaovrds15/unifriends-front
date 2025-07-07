import React, { useState, useEffect, useContext } from 'react';
// import '../components/components_css/SignUpPage.css'; // Remove this line
import logoImage from '../icons/image.png';
import InputMask from 'react-input-mask';
import { useNavigate } from 'react-router-dom';
import { RegistrationContext } from '../context/RegistrationContext';
import showIcon from '../icons/show.svg';
import hideIcon from '../icons/hide.svg';

const SignUpPage = ({setEmailVerified}) => {
  const CREATED = 201;
  const [majors, setMajors] = useState([]);
  const { registrationData, setRegistrationData } = useContext(RegistrationContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rePasswordVisible, setRePasswordVisible] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setEmailVerified(true);
  }, [setEmailVerified]);

  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/majors`,{
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
      setErrorMessage('Senhas diferentes');
    } else {
      setErrorMessage('');
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleRePasswordVisibility = () => {
    setRePasswordVisible(!rePasswordVisible)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (errorMessage) {
      return;
    }

    try {
      const response = await handleRegistrationSubmit();
      if (response.status === CREATED) {
        navigate('/upload-images');
        localStorage.removeItem('registrationData');
      }
    } catch (error) {
      setErrorMessage('Algo deu errado. Tente novamente mais tarde.');
    }
  };

  const handleRegistrationSubmit = async () => {
    const formattedData = {
      name: registrationData.firstName,
      email: registrationData.email,
      password: registrationData.password,
      re_password: registrationData.rePassword,
      phone_number: registrationData.phoneNumber.replace(/\D/g, ''),
      major_id: parseInt(registrationData.majorId),
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/register`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      return response;
    } catch (error) {
      setErrorMessage('Algo deu errado. Tente novamente mais tarde.');
    }
  };

  return (
    <form
      className="flex flex-col items-center justify-center min-h-screen bg-white font-sans"
      onSubmit={handleSubmit}
    >
      <img src={logoImage} alt="Logo" className="w-24 mb-5" />
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Cadastro</h2>

      <div className="relative w-72 mb-4">
        <input
          type="text"
          placeholder="Nome"
          name="firstName"
          value={registrationData.firstName}
          onChange={handleInputChange}
          required
          className="w-full px-5 py-2 rounded-full border border-green-700 outline-none text-base placeholder-green-700 focus:ring-2 focus:ring-green-500"
        />
      </div>
      <div className="relative w-72 mb-4">
        <input
          type="text"
          placeholder="Sobrenome"
          name="lastName"
          value={registrationData.lastName}
          onChange={handleInputChange}
          required
          className="w-full px-5 py-2 rounded-full border border-green-700 outline-none text-base placeholder-green-700 focus:ring-2 focus:ring-green-500"
        />
      </div>
      <div className="relative w-72 mb-4">
        <InputMask
          mask="(99) 99999-9999"
          value={registrationData.phoneNumber}
          onChange={(e) => handleInputChange({ target: { name: 'phoneNumber', value: e.target.value } })}
          placeholder="Telefone"
          required
        >
          {(inputProps) => (
            <input
              {...inputProps}
              type="tel"
              className="w-full px-5 py-2 rounded-full border border-green-700 outline-none text-base placeholder-green-700 focus:ring-2 focus:ring-green-500"
            />
          )}
        </InputMask>
      </div>
      <div className="relative w-72 mb-4">
        <select
          className="w-full px-5 py-2 rounded-full border border-green-700 outline-none text-base text-gray-700 focus:ring-2 focus:ring-green-500"
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
      <div className="relative w-72 mb-4">
        <input
          type={passwordVisible ? "text" : "password"}
          placeholder="Senha"
          name="password"
          value={registrationData.password}
          onChange={handleInputChange}
          required
          className="w-full px-5 py-2 rounded-full border border-green-700 outline-none text-base placeholder-green-700 focus:ring-2 focus:ring-green-500 pr-12"
        />
        <button
          className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent border-0 cursor-pointer focus:outline-none"
          type="button"
          onClick={togglePasswordVisibility}
        >
          <img src={passwordVisible ? hideIcon : showIcon} style={{ width: '25px', height: '25px' }} alt={passwordVisible ? 'Hide' : 'Show'} />
        </button>
      </div>
      <div className="relative w-72 mb-4">
        <input
          type={rePasswordVisible ? "text" : "password"}
          placeholder="Confirmar senha"
          name="rePassword"
          value={registrationData.rePassword}
          onChange={handlePasswordChange}
          required
          className="w-full px-5 py-2 rounded-full border border-green-700 outline-none text-base placeholder-green-700 focus:ring-2 focus:ring-green-500 pr-12"
        />
        <button
          className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent border-0 cursor-pointer focus:outline-none"
          type="button"
          onClick={toggleRePasswordVisibility}
        >
          <img src={rePasswordVisible ? hideIcon : showIcon} style={{ width: '25px', height: '25px' }} alt={rePasswordVisible ? 'Hide' : 'Show'} />
        </button>
      </div>

      <div className={`${errorMessage ? '' : 'hidden'} mb-2`}>
      {errorMessage && (
      <p className="text-red-600 text-sm text-center">{errorMessage}</p>
    )}
      </div>

      <button
        className="w-72 py-2 bg-green-700 text-white rounded-full font-medium text-base hover:bg-green-800 transition mb-2"
        type="submit"
      >
        Continuar
      </button>
    </form>
  );
};

export default SignUpPage;