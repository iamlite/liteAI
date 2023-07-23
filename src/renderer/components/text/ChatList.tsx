import {
  HiMiniPlusCircle,
  HiMiniChatBubbleOvalLeftEllipsis,
  HiOutlineTrash,
} from 'react-icons/hi2';
import { motion } from 'framer-motion';
import { useConversations, Message } from '../context/ConversationContext';
import React from 'react';
import { useLocation } from 'react-router-dom';

interface Conversation {
	id: number;
	messages: Message[];
}

function ChatList() {
  const {
    conversations,
    setConversations,
    setCurrentConversation,
    currentConversation,
  } = useConversations();

  const handleChatClick = (conversation: Conversation) => {
    setCurrentConversation(conversation);

    const index = conversations.findIndex((c) => c.id === conversation.id);

    if (index > -1) {
      const updatedConversations = [...conversations];
      updatedConversations.splice(index, 1);
      updatedConversations.unshift(conversation);
      setConversations(updatedConversations);
    }
  };

  const handleNewChat = () => {
    const newConversation: Conversation = { id: Date.now(), messages: [] };
    setConversations((prevConversations) => [
      newConversation,
      ...prevConversations,
    ]);
    setCurrentConversation(newConversation);
  };

  const handleClearAllConversations = () => {
    setConversations([]);
    setCurrentConversation(null);
  };

    // Use the useLocation hook to get the current location
    const location = useLocation();

    // Check if the pathname is '/text'
    const isTextRoute = location.pathname === '/text';
  
    // If not on the '/text' route, don't render the ChatList component
    if (!isTextRoute) {
      return null;
    }
  

  return (
    <motion.div
      layoutScroll
      style={{
        paddingTop: '2.75rem',
        paddingBottom: '1.75rem',
        height: '100%',
      }}
      initial={{ width: 0 }}
      animate={{ width: '20vw' }}
      exit={{ width: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col w-full h-full pl-5 pr-4 py-10 ml-2 rounded-2xl bg-base-200">
        <div className="flex flex-row items-center">
          <div className="flex flex-row items-center justify-center">
            <div className="text-xl text-center font-semibold">
              Chat History
            </div>
          </div>
          <div className="ml-auto">
            <button
              type="button"
              onClick={handleNewChat}
              className="flex items-center justify-center h-7 w-7 rounded-full"
            >
              <HiMiniPlusCircle className="w-5 h-5 hover:scale-150 transition duration-500 ease-in-out" />
            </button>
          </div>
        </div>
        <hr className="my-5 border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
        <div className="mt-2 cursor-pointer overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-xl scrollbar-thumb-primary ">
          <div className="flex flex-col -mx-3">
            {conversations.map((conversation, index) => (
              <motion.div
                layout
                key={conversation.id}
                onClick={() => handleChatClick(conversation)}
                whileHover={{ x: 10, transition: { duration: 0.1 } }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50, transition: { duration: 0.1 } }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex flex-row items-center p-4 ${
                  currentConversation &&
                  currentConversation.id === conversation.id
                    ? 'border-l-2 border-primary'
                    : ''
                }`}
              >
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-secondary font-bold flex-shrink-0">
                  <HiMiniChatBubbleOvalLeftEllipsis className="w-6 h-6" />
                </div>

                <div className="flex flex-col flex-grow ml-3">
                  <div className="text-sm truncate w-[20vh]">
                    {conversation.messages.length > 0
                      ? conversation.messages[conversation.messages.length - 1]
                          .content
                      : 'No messages yet'}
                  </div>
                  <div className="text-xs text-[0.65rem] font-medium">
                    Chat ID: {conversation.id}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="mt-auto">
          <button
            type="button"
            onClick={handleClearAllConversations}
            className="btn btn-block btn-outline btn-primary my-10"
          >
            <HiOutlineTrash className="w-5 h-5 mx-2" />
            Delete All History
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default ChatList;
