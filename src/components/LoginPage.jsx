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
    <div
      className="relative flex size-full min-h-screen flex-col bg-white justify-between group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      <img src={logoImage} alt="Logo" className="w-24 mb-5" />
      <div>
        <div className="flex flex-col gap-2 bg-white p-4 pb-2">
          <p className="text-[#111318] tracking-light text-[28px] font-bold leading-tight">Entrar no Unifriends</p>
        </div>
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <input
              placeholder="Email"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111318] focus:outline-0 focus:ring-0 border-none bg-[#f0f2f4] focus:border-none h-14 placeholder:text-[#616f89] p-4 text-base font-normal leading-normal"
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
            />
          </label>
        </div>
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <div className="relative">
              <input
                placeholder="Password"
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111318] focus:outline-0 focus:ring-0 border-none bg-[#f0f2f4] focus:border-none h-14 placeholder:text-[#616f89] p-4 text-base font-normal leading-normal pr-12"
                value={password}
                onChange={e => setPassword(e.target.value)}
                type={passwordVisible ? "text" : "password"}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute top-1/2 right-4 transform -translate-y-1/2"
                onClick={togglePasswordVisibility}
                tabIndex={-1}
              >
                <img src={passwordVisible ? hideIcon : showIcon} alt={passwordVisible ? "Hide password" : "Show password"} className="w-5 h-5" />
              </button>
            </div>
          </label>
        </div>
        {error && (
          <p className="text-red-500 text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center">{error}</p>
        )}
        <p className="text-[#616f89] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center underline" style={{ cursor: "pointer" }}>
          Esqueceu a senha?
        </p>
        <div className="flex px-4 py-3">
          <button
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 flex-1 bg-[#135bec] text-white text-sm font-bold leading-normal tracking-[0.015em]"
            onClick={handleLoginClick}
            type="button"
          >
            <span className="truncate">Entrar</span>
          </button>
        </div>
      </div>
      <div>
        <p className="text-[#616f89] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center">
          Ao continuar, você concorda com nossos Termos de Serviço e Política de Privacidade
        </p>
        <div className="flex px-4 py-3">
          <button
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 flex-1 bg-transparent text-[#111318] text-sm font-bold leading-normal tracking-[0.015em]"
            onClick={handleSignUpClick}
            type="button"
          >
            <span className="truncate">Não tem uma conta? Registrar</span>
          </button>
        </div>
        <div className="h-5 bg-white"></div>
      </div>
    </div>
);
};

export default LoginPage;