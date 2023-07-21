import { HiHome } from 'react-icons/hi2';
import React from 'react';

interface HomeButtonProps {
  onClick: () => void;
}

function HomeButton({ onClick }: HomeButtonProps) {
  return (
    <button type="button" className="flex items-center" onClick={onClick}>
      <span className="flex items-center justify-center h-12 w-12 rounded-full hover:scale-150 transition duration-500 ease-in-out">
        <HiHome className="w-6 h-6" />
      </span>
    </button>
  );
}

export default HomeButton;
