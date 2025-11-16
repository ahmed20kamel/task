import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './i18n';
import App from './App';
import { AuthProvider } from './context/AuthContext';

// Set initial language and direction
const savedLanguage = localStorage.getItem('language') || 'ar';
const isRtl = savedLanguage === 'ar';
document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
document.documentElement.setAttribute('lang', savedLanguage);
document.body.setAttribute('dir', isRtl ? 'rtl' : 'ltr');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

