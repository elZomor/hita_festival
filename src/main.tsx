import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { festivalConfig } from './config/festival';

const savedLanguage = localStorage.getItem('language') || 'ar';
document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = savedLanguage;
document.title = savedLanguage === 'ar' ? festivalConfig.titleAr : festivalConfig.titleEn;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
