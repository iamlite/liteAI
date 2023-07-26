import React, { useContext, useState } from 'react';
import { HiMiniMoon, HiSun } from 'react-icons/hi2';
import { motion } from 'framer-motion';
import { ToastContext } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';

function DarkModeToggle() {
  const [isHovered, setIsHovered] = useState(false);
  const toastContext = useContext(ToastContext);
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  const handleToggleTheme = () => {
    const { addToast } = toastContext;

    toggleTheme();
    const message =
      theme === 'light' ? 'Dark mode enabled' : 'Light mode enabled';
    addToast(message, 'success');
  };

  const moonVariants = {
    hovered: {
      scale: 1.6,
      rotate: 80,
    },
    unhovered: {
      scale: 1,
      rotate: 0,
    },
  };

  const sunVariants = {
    hovered: {
      scale: 1.8,
      rotate: 360,
    },
    unhovered: {
      scale: 1,
      rotate: 0,
    },
  };

  return (
    <button
      type="button"
      className="mt-auto flex items-center justify-center h-10 w-10"
      onClick={handleToggleTheme}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isDarkMode ? (
        <motion.span
          initial={false}
          animate={isHovered ? 'hovered' : 'unhovered'}
          variants={moonVariants}
          transition={{ duration: 0.2 }}
        >
          <HiMiniMoon id="darkModeIcon" className="w-6 h-6" />
        </motion.span>
      ) : (
        <motion.span
          initial={false}
          animate={isHovered ? 'hovered' : 'unhovered'}
          variants={sunVariants}
          transition={{ duration: 0.2 }}
        >
          <HiSun id="lightModeIcon" className="w-7 h-7" />
        </motion.span>
      )}
    </button>
  );
}

export default DarkModeToggle;
