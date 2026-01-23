import { createContext, useContext, useState } from 'react';
import Notification from '../components/common/Notification';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success', // success | error | info
  });

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });

    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  return (
    <NotificationContext.Provider value={{ showNotification, notification }}>
      {children}
      <Notification />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
