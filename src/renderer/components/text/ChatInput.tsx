import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  AiFillCloseCircle,
  AiOutlineSend,
  AiFillTags,
  AiOutlineClose,
} from 'react-icons/ai';
import { callOpenAI, stopOpenAI } from './openaiApi';
import { useSettings } from '../context/SettingsContext';
import { useConversations, Conversation, Message } from '../context/ConversationContext';
import { ToastContext } from '../context/ToastContext';
import { v4 as uuidv4 } from 'uuid';
import { useTiktoken } from '@components/context/TiktokenContext';
import SnippetsMenu from './TSnippetsMenu';
import ReactDOM from 'react-dom';
import { motion } from 'framer-motion';

function useOutsideClick(ref: React.RefObject<HTMLElement>, callback: () => void) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setTimeout(callback, 100);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
}

function ChatInput() {
  const { settings } = useSettings();
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const {
    conversations,
    setConversations,
    currentConversation,
    setCurrentConversation,
  } = useConversations();

  const [message, setMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const { addToast } = useContext(ToastContext);
  const { getTokenCount, incrementTotalTokenUsage } = useTiktoken();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (message.trim() !== '') {
      const newConversations = [...conversations];
      let currentMessages: Message[];

      if (!currentConversation) {
        const newConversation: Conversation = { id: Date.now(), messages: [] };
        newConversations.unshift(newConversation);
        setCurrentConversation(newConversation);
        currentMessages = newConversation.messages;
      } else {
        currentMessages = currentConversation.messages;
      }


      const tokenCount = getTokenCount(message);
      currentMessages.push({ id: uuidv4(), role: 'user', content: message, tokenCount });
      incrementTotalTokenUsage(tokenCount);
      setConversations(newConversations);
      setMessage('');
      setIsGenerating(true);

      scrollToBottom();
    }
  };


  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  const handleStop = () => {
    addToast('Response stopped', 'danger');
    stopOpenAI();
    setIsGenerating(false);
  };

  useEffect(() => {
    const callApi = async () => {
      const { messages } = currentConversation;
      let assistantContent = '';
      let assistantTokensAdded = false;
      if (messages.length > 0 && messages[messages.length - 1].role === 'user') {
        await callOpenAI(messages, settingsRef.current, (response) => {
          if (response.content === '[DONE]') {
            const tokenCount = getTokenCount(assistantContent);
            if (messages[messages.length - 1].role === 'assistant') {
              messages[messages.length - 1].tokenCount = tokenCount;
              if (!assistantTokensAdded) {
                incrementTotalTokenUsage(tokenCount);
                assistantTokensAdded = true;
              }
            }
            setIsGenerating(false);
          } else {
            assistantContent += response.content;
            if (messages[messages.length - 1].role === 'assistant') {
              messages[messages.length - 1].content += response.content;
            } else {
              messages.push({ id: uuidv4(), role: 'assistant', content: response.content, tokenCount: 0 });
            }
          }
          setConversations((prevConversations: Conversation[]) => {
            const newConversations = [...prevConversations];
            const currentConversationIndex = newConversations.findIndex(
              (conversation) => conversation.id === currentConversation?.id
            );
            if (currentConversationIndex !== -1) {
              newConversations[currentConversationIndex].messages = messages;
            }
            return newConversations;
          });
        });
      }
    };

    if (isGenerating) {
      callApi();
    }
  }, [currentConversation, setConversations, isGenerating, getTokenCount, incrementTotalTokenUsage]);


  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversations]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 120);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [message]);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleSnippetSelect = (snippet: string) => {
    setMessage((prevMessage) => `${prevMessage} ${snippet}`);
  };

  const menuRef = useRef(null);
  useOutsideClick(menuRef, () => setMenuVisible(false));

  const clearInput = () => {
    setMessage('');
  };

  return (
    <motion.footer
      className="text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <form onSubmit={handleSubmit}>
          <div className="flex items-center px-3 py-2 rounded-lg bg-neutral transition ease-in-out duration-500">
            <motion.button
              id="promptHelperBtn"
              type='button'
              className='bg-transparent rounded-full mx-3'
              ref={buttonRef}
              onClick={toggleMenu}
              whileHover={{ scale: [null, 1.5, 1.3, 1.4] }}
              transition={{ duration: 0.3 }}
              whileTap={{ scale: 0.9 }}
            >
              <AiFillTags className='w-6 h-6 text-secondary' />
            </motion.button>

            {menuVisible &&
              ReactDOM.createPortal(
                <motion.div
                  ref={menuRef}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <SnippetsMenu
                    visible={menuVisible}
                    buttonRef={buttonRef}
                    onSelect={handleSnippetSelect}
                  />
                </motion.div>,
                document.body,
              )}

            <textarea
              ref={textareaRef}
              id="textnput"
              rows={1}
              className="textarea w-full resize-none focus:outline-none bg-neutral text-neutral-content"
              placeholder="Your message..."
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={handleKeyDown}
            />
            {message && (
              <motion.button
                type="button"
                className="bg-transparent rounded-full mx-3"
                onClick={clearInput}
                whileHover={{ scale: 1.5 }}
                whileTap={{ scale: 0.9 }}
              >
                <AiOutlineClose className="w-4 h-4 text-secondary" />
              </motion.button>
            )}
            <motion.button
              id="sendBtn"
              type="submit"
              className="bg-transparent rounded-full mx-3"
              whileHover={{ scale: [null, 1.5, 1.3, 1.4] }}
              transition={{ duration: 0.3 }}
              whileTap={{ scale: 0.9 }}
            >
              <AiOutlineSend className="w-6 h-6 text-secondary" />
            </motion.button>

            {isGenerating && (
              <motion.button
                type="button"
                id="stopBtn"
                onClick={handleStop}
                className="bg-transparent rounded-full mx-3"
                whileHover={{ scale: [null, 1.5, 1.3, 1.4] }}
                transition={{ duration: 0.3 }}
                whileTap={{ scale: 0.9 }}
              >
                <AiFillCloseCircle className="w-6 h-6 text-error" />
              </motion.button>
            )}
          </div>
        </form>
      </div>
    </motion.footer>
  );
}

export default ChatInput;
