import React, { useState, useEffect } from 'react';

const ThemeSwitcher: React.FC = () => {
  const [theme, setTheme] = useState('default');

  useEffect(() => {
    if (theme === 'gold-white') {
      document.documentElement.setAttribute('data-theme', 'gold-white');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'default' ? 'gold-white' : 'default'));
  };

  return (
    <button onClick={toggleTheme} className="p-2 bg-primary text-primary-foreground rounded">
      Switch Theme
    </button>
  );
};

export default ThemeSwitcher;
