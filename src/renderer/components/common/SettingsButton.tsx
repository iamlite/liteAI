import React, { useState } from 'react';
import { HiCog } from 'react-icons/hi2';
import { motion, useMotionValue, useTransform } from 'framer-motion';

interface SettingsButtonProps {
  onClick: () => void;
}

function SettingsButton({ onClick }: SettingsButtonProps) {
  const [, setIsHovered] = useState(false);
  const scale = useMotionValue(1);
  const rotate = useTransform(scale, [1, 1.8], [0, 360]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    scale.set(1.8);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    scale.set(1);
  };

  return (
    <button
      type="button"
      className="flex items-center"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.span
        className="flex items-center justify-center h-12 w-12 rounded-full hover:scale-150 transition duration-500 ease-in-out"
        style={{
          scale,
          rotate,
        }}
      >
        <HiCog className="w-6 h-6" />
      </motion.span>
    </button>
  );
}

export default SettingsButton;