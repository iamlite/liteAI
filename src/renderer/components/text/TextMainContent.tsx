import React from 'react';
import { motion } from 'framer-motion';
import MessageBox from './MessageBox';
import ChatInput from './ChatInput';
import { useConversations } from '../context/ConversationContext';
import { useSettings } from '../context/SettingsContext';

const MainContent: React.FC = function MainContentComponent() {
  useConversations();
  useSettings();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ width: '100%' }}
    >
      <div className="flex flex-col h-full pb-7 pt-10 px-5">
        <MessageBox />
        <ChatInput />
      </div>
    </motion.div>
  );
};

export default MainContent;
