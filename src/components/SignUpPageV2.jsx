import React, { useState, useEffect, useContext } from "react";
import { Combobox } from '@headlessui/react';
import { RegistrationContext } from "../context/RegistrationContext";
import {
  getMajors,
  sendRegistrationData,
} from "../services/registrationService";

export default function SignUpPageV2() {
  const [name, setName] = useState("");
  const [query, setQuery] = useState("");
  const [majors, setMajors] = useState([]);
  const { registrationData, setRegistrationData } =
    useContext(RegistrationContext);
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const filteredMajors =
    query === ""
      ? majors
      : majors.filter((major) =>
          major.name.toLowerCase().includes(query.toLowerCase())
        );

  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const response = await getMajors();
        setMajors(response.data.majors);
      } catch (error) {
        setErrorMessage("Algo deu errado");
      }
    };
    fetchMajors();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...registrationData, [name]: value };

    setRegistrationData(updatedData);

    const { password, rePassword, ...dataToSave } = updatedData;
    localStorage.setItem("registrationData", JSON.stringify(dataToSave));
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-slate-50 justify-between group/design-root overflow-x-hidden">
      <div>
        <div className="flex items-center bg-slate-50 p-4 pb-2 justify-between">
          <div
            className="text-[#0d151c] flex size-12 shrink-0 items-center"
            data-icon="ArrowLeft"
            data-size="24px"
            data-weight="regular"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24px"
              height="24px"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
            </svg>
          </div>
          <h2 className="text-[#0d151c] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
            Criar Conta
          </h2>
        </div>
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <input
              placeholder="Nome"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0d151c] focus:outline-0 focus:ring-0 border-none bg-[#e7edf4] focus:border-none h-14 placeholder:text-[#49749c] p-4 text-base font-normal leading-normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
        </div>
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
             <Combobox
              value={majors.find(m => m.id === registrationData.majorId) || null}
              onChange={major => {
                handleInputChange({ target: { name: "majorId", value: major.id } });
              }}
              nullable
            >
              <div className="relative">
                <Combobox.Input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0d151c] focus:outline-0 focus:ring-0 border-none bg-[#e7edf4] h-14 placeholder:text-[#49749c] p-4 text-base font-normal leading-normal"
                  displayValue={major => (major ? major.name : "")}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Selecione seu curso"
                />
                <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {filteredMajors.length === 0 && query !== "" ? (
                    <div className="relative cursor-default select-none py-2 px-4 text-[#49749c]">
                      Nenhum curso encontrado
                    </div>
                  ) : (
                    filteredMajors.map((major) => (
                      <Combobox.Option
                        key={major.id}
                        value={major}
                        className={({ active }) =>
                          `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                            active ? 'bg-[#e7edf4] text-[#0d151c]' : 'text-[#0d151c]'
                          }`
                        }
                      >
                        {major.name}
                      </Combobox.Option>
                    ))
                  )}
                </Combobox.Options>
              </div>
            </Combobox>
          </label>
        </div>
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <textarea
              placeholder="A Little Description About Yourself"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0d151c] focus:outline-0 focus:ring-0 border-none bg-[#e7edf4] focus:border-none min-h-36 placeholder:text-[#49749c] p-4 text-base font-normal leading-normal"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </label>
        </div>
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <input
              type="password"
              placeholder="Password"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0d151c] focus:outline-0 focus:ring-0 border-none bg-[#e7edf4] focus:border-none h-14 placeholder:text-[#49749c] p-4 text-base font-normal leading-normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <input
              type="password"
              placeholder="Confirm Password"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0d151c] focus:outline-0 focus:ring-0 border-none bg-[#e7edf4] focus:border-none h-14 placeholder:text-[#49749c] p-4 text-base font-normal leading-normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </label>
        </div>
        <div className="flex px-4 py-3">
          <button
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 flex-1 bg-[#0b81ef] text-slate-50 text-base font-bold leading-normal tracking-[0.015em]"
            type="button"
          >
            <span className="truncate">Sign Up</span>
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
}
