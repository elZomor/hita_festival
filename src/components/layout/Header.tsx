import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Sun, Moon, Languages } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const isRTL = i18n.language === 'ar';

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/festival', label: t('nav.editions') },
    { to: '/articles', label: t('nav.articles') },
    { to: '/creativity', label: t('nav.creativity') },
    { to: '/about', label: t('nav.about') },
  ];

  return (
    <header className="sticky top-0 z-50 bg-theatre-black dark:bg-theatre-black border-b-2 border-theatre-gold shadow-xl transition-all duration-300">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-theatre-red rounded-full flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
              <span className="text-2xl text-white">🎭</span>
            </div>
            <div className={`hidden md:block ${isRTL ? 'text-right' : 'text-left'}`}>
              <h1 className="text-xl font-bold text-theatre-gold">
                {t('home.title')}
              </h1>
              <p className="text-xs text-gray-400">
                {t('home.subtitle')}
              </p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-white hover:text-theatre-gold transition-colors duration-300 font-medium relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-theatre-gold group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-lg hover:bg-theatre-red transition-colors duration-300 text-white"
              aria-label="Toggle language"
            >
              <Languages size={20} />
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-theatre-red transition-colors duration-300 text-white"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-theatre-red transition-colors duration-300 text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2 animate-fadeIn">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 px-4 text-white hover:bg-theatre-red rounded-lg transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
};
