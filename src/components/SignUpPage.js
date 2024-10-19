import React, { useState, useEffect } from 'react';
import '../components/components_css/SignUpPage.css';
import logoImage from '../icons/image.png';
import InputMask from 'react-input-mask';

const SignUpPage = () => {
    const [majors, setMajors] = useState([]);
    const [selectedMajor, setSelectedMajor] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    useEffect(() => {
        const fetchMajors = async () => {
            try {
                const response = await fetch('http://localhost:8090/api/majors', {
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

    return (
        <div className="signup-container">
            <img src={logoImage} alt="Logo" className="logo" />
            <h2>Cadastro</h2>

            <div className="input-container">
                <input type="text" placeholder="Nome" />
            </div>
            <div className="input-container">
                <input type="text" placeholder="Sobrenome" />
            </div>
            <div className="input-container">
                <InputMask
                    mask="(99) 99999-9999"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Telefone"
                >
                    {(inputProps) => <input {...inputProps} type="tel" />}
                </InputMask>
            </div>
            <div className="input-container">
                <select
                    className="dropdown"
                    value={selectedMajor}
                    onChange={(e) => setSelectedMajor(e.target.value)}
                >
                    <option value="">Selecione seu curso</option>
                    {majors.map((major) => (
                        <option key={major.id} value={major.name}>
                            {major.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="input-container">
                <input type="password" placeholder="Senha" />
                <button className="toggle-password">
                    <span role="img" aria-label="eye">👁️</span>
                </button>
            </div>
            <div className="input-container">
                <input type="password" placeholder="Confirmar senha" />
                <button className="toggle-password">
                    <span role="img" aria-label="eye">👁️</span>
                </button>
            </div>

            <button className="signup-button">Continuar</button>

            <p className="login-text">Já possui conta? <a href="#">Faça login</a></p>
        </div>
    );
};

export default SignUpPage;