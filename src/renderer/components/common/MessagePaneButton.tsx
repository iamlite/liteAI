import { AiOutlineMenu } from 'react-icons/ai';
import React from 'react';
import { useLocation } from 'react-router-dom';

interface MessagePaneButtonProps {
  onClick: () => void;
}

function MessagePaneButton({ onClick }: MessagePaneButtonProps) {
    const location = useLocation();
    const isActive = location.pathname === '/chatlist';
  return (
    <button type="button" className={`flex items-center ${isActive ? 'border-b-2 rounded-full ' : ''}`} onClick={onClick}>
      <span className="flex items-center justify-center h-12 w-12 rounded-full hover:scale-150 hover:rotate-90 transition duration-500 ease-in-out">
        <AiOutlineMenu className="w-6 h-6" />
      </span>
    </button>
  );
}

export default MessagePaneButton;
