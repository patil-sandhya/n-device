'use client';
import { createContext, useState, useContext, useEffect } from 'react';
import Alert from './Alert';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alertArray, setAlertArray] = useState([]);

  const removeAlert = (removeId) => {
    setAlertArray((arr) => arr.filter(({ key }) => key != removeId));
  };

  const setAlert = (type, msg) => {
    const id = Date.now();
    setAlertArray((arr) => [
      ...arr,
      <Alert id={id} key={id} alertType={type} message={msg} />
    ]);

    setTimeout(() => {
      removeAlert(id);
    }, 5000);
  };
  return (
    <AlertContext.Provider value={{ setAlert}}>
      {children}
      {alertArray.length !== 0 && (
        <div className="fixed left-1/2 top-10 z-50 w-11/12 -translate-x-1/2 gap-1 sm:w-fit">
          {alertArray?.map((item, index) => (
            <div key={index} className="relative">
              {item}
            </div>
          ))}
        </div>
      )}
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);