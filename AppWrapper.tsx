import React, { useState } from 'react';
import App from './App';
import { AuthPage } from './components/AuthPage';
import { getCurrentUser, setCurrentUser, clearCurrentUser } from './services/userService';
import { LanguageProvider } from './contexts/LanguageContext';

const AppWrapper: React.FC = () => {
  const [currentUser, _setCurrentUser] = useState<string | null>(getCurrentUser());

  const handleLogin = (username: string) => {
    setCurrentUser(username);
    _setCurrentUser(username);
  };

  const handleLogout = () => {
    clearCurrentUser();
    _setCurrentUser(null);
  };

  return (
    <LanguageProvider>
      {currentUser ? (
        <App username={currentUser} onLogout={handleLogout} />
      ) : (
        <AuthPage onLoginSuccess={handleLogin} />
      )}
    </LanguageProvider>
  );
};

export default AppWrapper;
