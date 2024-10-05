import React from 'react';
import '../components/components_css/SignUpPage.css';
import logoImage from '../icons/image.png'

const SignUpPage = () => {
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
                <input type="email" placeholder="E-mail" />
            </div>
            <div className="input-container">
                <input type="tel" placeholder="Telefone" />
            </div>
            <div className="input-container">
                <select className="dropdown">
                    <option value="">Selecione seu curso</option>
                    <option value="engenharia">Engenharia</option>
                    <option value="medicina">Medicina</option>
                    <option value="direito">Direito</option>
                    <option value="ciencias-da-computacao">Ciências da Computação</option>
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

            <button className="signup-button">Cadastrar</button>

            <p className="login-text">Já possui conta? <a href="#">Faça login</a></p>
        </div>
    );
};

export default SignUpPage;