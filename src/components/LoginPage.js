import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/components_css/LoginPage.css';
import logoImage from '../icons/image.png';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLoginClick = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8090/api/login', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password
                }),
            });

            console.log(response);
            if (response.status === 204) {
                
                console.log('Login successful');
                navigate('/affinity');
            } else {
                const data = await response.json();
                setError(data.message || 'Login failed');
            }
        } catch (error) {
            setError('Network error: ' + error.message);
        }
    };

    const handleSignUpClick = () => {
        navigate('/signup/email');
    };

    return (
        <div className="login-container">
            <img src={logoImage} alt="Logo" className="logo" />
            <h2>Unifriends</h2>
            <form onSubmit={handleLoginClick}>
                <div className="input-container">
                    <input 
                        type="email" 
                        placeholder="E-mail" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-container">
                    <input 
                        type="password" 
                        placeholder="Senha" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button className="toggle-password" type="button">
                        <span role="img" aria-label="eye">👁️</span>
                    </button>
                </div>
                {error && <p className="error-text">Usuário ou Senha Incorreta</p>} {/* Display error if login fails */}
                <button type="submit" className="login-button">Entrar</button>
            </form>
            <p className="signup-text">
                <button onClick={handleSignUpClick} className="signup-button-link">
                    Cadastre-se, é grátis
                </button>
            </p>
        </div>
    );
};

export default LoginPage;