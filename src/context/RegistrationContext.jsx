import React, { createContext, useState, useEffect } from 'react';

export const RegistrationContext = createContext();

export const RegistrationProvider = ({ children }) => {
  const [registrationData, setRegistrationData] = useState(() => {
    const savedData = localStorage.getItem('registrationData');
    return savedData ? JSON.parse(savedData) : {
      password: '',
      rePassword: '',
      email: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      profilePictureUrl: '',
      usersImages: [],
      majorId: '',
      description: '',
    };
  });

  useEffect(() => {
    localStorage.setItem('registrationData', JSON.stringify(registrationData));
  }, [registrationData]);

  return (
    <RegistrationContext.Provider value={{ registrationData, setRegistrationData }}>
      {children}
    </RegistrationContext.Provider>
  );
};