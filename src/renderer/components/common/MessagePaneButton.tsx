import { AiOutlineMenu } from 'react-icons/ai';
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';
import { useLocation } from 'react-router-dom';

interface MessagePaneButtonProps {
  onClick: () => void;
  isExpanded: boolean;
}

function MessagePaneButton({ onClick, isExpanded }: MessagePaneButtonProps) {
  const location = useLocation();
  const isActive = location.pathname === '/chatlist';

  const textVariants = {
    open: { opacity: 1, transition: { duration: 0.3 } },
    closed: { opacity: 0 },
  };

  const buttonStyle = isExpanded ? 'btn btn-ghost justify-start' : 'btn btn-circle btn-ghost';

  return (
    <button
      type="button"
      className={`${buttonStyle} ${isActive ? 'border-b-2 rounded-full ' : ''}`}
      onClick={onClick}
    >
      <span className="flex items-center justify-center">
        <AiOutlineMenu className="w-6 h-6" />
        <AnimatePresence>
          {isExpanded && (
            <motion.span
              className="ml-2"
              variants={textVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              Messages
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </button>
  );
}

export default MessagePaneButton;
