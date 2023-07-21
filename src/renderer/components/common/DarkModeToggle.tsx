import React, { useContext, useState } from 'react';
import { HiMiniMoon, HiSun } from 'react-icons/hi2';
import { useSpring, animated } from '@react-spring/web';
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

  const moonSpringProps = useSpring({
    transform: isHovered ? 'scale(1.6) rotate(80deg)' : 'scale(1) rotate(0deg)',
    config: { tension: 50, friction: 45 },
  });

  const sunSpringProps = useSpring({
    transform: isHovered
      ? 'scale(1.8) rotate(360deg)'
      : 'scale(1) rotate(0deg)',
    config: { tension: 50, friction: 75 },
  });

  return (
    <button
      type="button"
      className="mt-auto flex items-center justify-center h-10 w-10"
      onClick={handleToggleTheme}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isDarkMode ? (
        <animated.span style={moonSpringProps}>
          <HiMiniMoon id="darkModeIcon" className="w-6 h-6" />
        </animated.span>
      ) : (
        <animated.span style={sunSpringProps}>
          <HiSun id="lightModeIcon" className="w-7 h-7" />
        </animated.span>
      )}
    </button>
  );
}

export default DarkModeToggle;
