import React, { useState, useContext, useEffect, useCallback, useRef } from 'react';
import { HttpStatusCode } from 'axios';
import { useNavigate } from 'react-router-dom';
import { RegistrationContext } from '../context/RegistrationContext';
import { getVerificationCodeExpiration, sendVerificationCode, submitVerificationEmail } from '../services/registrationService';
import BackButton from "./BackButton";

const VerificationCodePage = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState(new Array(6).fill(''));
  const [timer, setTimer] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const { registrationData } = useContext(RegistrationContext);
  const { email } = registrationData;
  const inputsRef = useRef([]);

  const getExpirationTime = useCallback(async () => {
    if (!email) return 0;
    try {
      const response = await getVerificationCodeExpiration(email);
      return response.data.expiration_time;
    } catch (error) {
      return 0;
    }
  }, [email]);

  useEffect(() => {
    if (!email) {
      navigate('/signup-email');
      return;
    }
    const fetchExpirationTime = async () => {
      const expirationTime = await getExpirationTime();
      setTimer(expirationTime);
    };

    fetchExpirationTime();
  }, [getExpirationTime, email, navigate]);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  const handleInputChange = (e, index) => {
    const { value } = e.target;
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1].focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d{1,6}$/.test(pasteData)) return;
    const newCode = new Array(6).fill('');
    for (let i = 0; i < pasteData.length; i++) {
      newCode[i] = pasteData[i];
    }
    setCode(newCode);
    const nextFocusIndex = Math.min(pasteData.length, 5);
    inputsRef.current[nextFocusIndex].focus();
  };


  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join('');
    if (verificationCode.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit code.');
      return;
    }
    try {
      await sendVerificationCode(email, verificationCode);
      navigate('/signup');
    } catch (error) {
      if (error.response && error.response.status === HttpStatusCode.Unauthorized) {
        setErrorMessage('Código de verificação inválido');
      } else {
        setErrorMessage('Algo deu errado. Tente novamente mais tarde');
      }
    }
  };

  const handleResendCode = async () => {
    try {
      const response = await submitVerificationEmail(email);
      setErrorMessage('');
      setCode(new Array(6).fill(''));
      setTimer(response.data.expiration_time);
      inputsRef.current[0].focus();
    } catch (error) {
      setTimer(0);
      setErrorMessage('Failed to resend verification code. Please try again.');
    }
  };

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  return (
    <div
      className="relative flex h-auto min-h-screen w-full flex-col bg-white-50 justify-between overflow-x-hidden"
      style={{ fontFamily: '"Be Vietnam Pro", "Noto Sans", sans-serif' }}
    >
      <div>
        <div className="flex items-center p-4 pb-2 justify-between">
          <BackButton />
          <h2 className="text-[#0d151c] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Verificação</h2>
        </div>
        <h1 className="text-[#0d151c] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 text-center pb-3 pt-5">Código de Verificação</h1>
        <p className="text-[#0d151c] text-base font-normal leading-normal pb-3 pt-1 px-4 text-center">Digite abaixo o código de verificação enviado para seu email</p>
        <div className="flex justify-center px-4 py-3">
          <fieldset className="relative flex gap-4" onPaste={handlePaste}>
            {code.map((digit, index) => (
              <input
                key={index}
                ref={el => inputsRef.current[index] = el}
                className="flex h-14 w-12 text-center [appearance:textfield] focus:outline-0 focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none border-0 border-b-2 border-[#cedce8] focus:border-b-2 focus:border-[#0b81ef] text-xl font-semibold"
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleInputChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                disabled={timer === 0}
              />
            ))}
          </fieldset>
        </div>
        {errorMessage && (
          <p className="text-red-600 text-sm text-center mb-2 px-4">{errorMessage}</p>
        )}
        {timer > 0 && (
          <div className="flex gap-4 py-6 px-4">
            <div className="flex grow basis-0 flex-col items-stretch gap-4">
              <div className="flex h-14 grow items-center justify-center rounded-lg px-3 bg-[#e7edf4]">
                <p className="text-[#0d151c] text-lg font-bold leading-tight tracking-[-0.015em]">{String(minutes).padStart(2, '0')}</p>
              </div>
              <div className="flex items-center justify-center"><p className="text-[#0d151c] text-sm font-normal leading-normal">Minutos</p></div>
            </div>
            <div className="flex grow basis-0 flex-col items-stretch gap-4">
              <div className="flex h-14 grow items-center justify-center rounded-lg px-3 bg-[#e7edf4]">
                <p className="text-[#0d151c] text-lg font-bold leading-tight tracking-[-0.015em]">{String(seconds).padStart(2, '0')}</p>
              </div>
              <div className="flex items-center justify-center"><p className="text-[#0d151c] text-sm font-normal leading-normal">Segundos</p></div>
            </div>
          </div>
        )}
      </div>
      <div>
        <div className="flex justify-center">
          <div className="flex flex-1 gap-3 max-w-[480px] flex-col items-stretch px-4 py-3">
            <button
              onClick={handleVerificationSubmit}
              disabled={timer === 0 || code.join('').length !== 6}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-[#0b81ef] text-slate-50 text-base font-bold leading-normal tracking-[0.015em] w-full disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <span className="truncate">Verificar</span>
            </button>
            <button
              onClick={handleResendCode}
              disabled={timer > 0}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-[#e7edf4] text-[#0d151c] text-base font-bold leading-normal tracking-[0.015em] w-full disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <span className="truncate">Reenviar Código</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationCodePage;