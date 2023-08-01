import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageBox from './MessageBox';
import ChatInput from './ChatInput';
import ChatList from './ChatList';
import { useConversations } from '@context/ConversationContext';
import { useSettings } from '@context/SettingsContext';

const MainContent: React.FC = function MainContentComponent() {
  useConversations();
  useSettings();
  const [isChatListOpen, setIsChatListOpen] = useState(false);

  const toggleChatList = () => {
    setIsChatListOpen(!isChatListOpen);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex"
      style={{ width: '100%', height: '100%' }}
    >
      <AnimatePresence>
        {isChatListOpen && (
          <motion.div
            className="flex-shrink-0"
            key="chatList"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <ChatList />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex flex-col flex-grow pb-7 pt-10 px-5">
        <MessageBox toggleChatList={toggleChatList} />
        <ChatInput />
      </div>
    </motion.div>
  );
};

export default MainContent;
