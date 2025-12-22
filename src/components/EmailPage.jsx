import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "../icons/image.png";
import { RegistrationContext } from "../context/RegistrationContext";
import { submitVerificationEmail } from "../services/registrationService";
import BackButton from "./BackButton";

const EmailPage = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const { registrationData, setRegistrationData } =
    useContext(RegistrationContext);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitVerificationEmail(registrationData.email);
      navigate("/signup/verification");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Algo deu errado. Tente novamente mais tarde.");
      }
    }
  };

    return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-white justify-between group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Be Vietnam Pro", "Noto Sans", sans-serif' }}
    >
      <div>
        <div className="flex items-center bg-white-50 p-4 pb-2 justify-between">
          <BackButton />
          <h2 className="text-[#0d151c] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
            Digite seu email
          </h2>
        </div>
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <input
              placeholder="Email"
              className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0d151c] focus:outline-0 focus:ring-0 bg-[#e7edf4] focus:border-none h-14 placeholder:text-[#49749c] p-4 text-base font-normal leading-normal ${errorMessage ? 'border border-red-500' : 'border-none'}`}
              value={registrationData.email}
              onChange={(e) => {
                setRegistrationData({ ...registrationData, email: e.target.value });
                if (errorMessage) {
                  setErrorMessage('');
                }
              }}
            />
            {errorMessage && (
              <div className="flex items-center text-red-500 text-sm mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256" className="mr-1">
                  <path d="M128,24a104,104,0,1,0,104,104A104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm8,32a12,12,0,1,1,12-12A12,12,0,0,1,128,168Z"></path>
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}
          </label>
        </div>
        <div className="flex px-4 py-3">
          <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 flex-1 bg-[#0b81ef] text-slate-50 text-base font-bold leading-normal tracking-[0.015em]"
            onClick={handleEmailSubmit}
          >
            <span className="truncate">Continuar</span>
          </button>
        </div>
      </div>
      <div>
        <div
          className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-none group-[:not(.dark)]/design-root:hidden"
          style={{
            backgroundImage: 'url("/dark.svg")',
            aspectRatio: "390 / 320",
          }}
        ></div>
        <div
          className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-none group-[.dark]/design-root:hidden"
          style={{
            backgroundImage: 'url("/light.svg")',
            aspectRatio: "390 / 320",
          }}
        ></div>
      </div>
    </div>
  );
};

export default EmailPage;
