import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../icons/image.png';
import showIcon from '../icons/show.svg';
import hideIcon from '../icons/hide.svg';
import { useUser } from '../context/UserContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { loginUser } = useUser();

    const handleLoginClick = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/login`, {
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

            if (response.status === 200) {
                const userData = await response.json();
                loginUser(userData.data);
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

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleSignUpClick = () => {
        navigate('/signup/email');
    };

    return (
    <div className="flex flex-col items-center justify-center h-screen bg-white font-sans">
        <img src={logoImage} alt="Logo" className="w-24 mb-5" />
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Unifriends</h2>
        <form onSubmit={handleLoginClick} className="w-full max-w-xs mx-auto flex flex-col gap-4">
            <div className="relative">
                <input 
                    type="email" 
                    placeholder="E-mail" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
            </div>
            <div className="relative">
                <input 
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Senha" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <button 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500"
                    type="button" 
                    onClick={togglePasswordVisibility}
                >
                    <img 
                        src={passwordVisible ? hideIcon : showIcon} 
                        alt={passwordVisible ? 'Hide' : 'Show'} 
                        className="w-6 h-6"
                    />
                </button>
            </div>
            {error && <p className="text-red-500 text-sm mb-0 text-center">Usuário ou Senha Incorreta</p>}
            <button 
                type="submit" 
                className="w-full py-2 bg-green-600 text-white rounded-full hover:bg-green-800 active:bg-green-900 transition focus:outline-none focus:ring-2 focus:ring-green-500"
            >
                Entrar
            </button>
        </form>
        <p className="text-sm text-green-600 mt-4">
            <button 
                onClick={handleSignUpClick} 
                className="underline hover:no-underline"
            >
                Cadastre-se, é grátis
            </button>
        </p>
    </div>
);
};

export default LoginPage;