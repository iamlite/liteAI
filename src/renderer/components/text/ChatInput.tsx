import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  AiFillCloseCircle,
  AiOutlineSend,
  AiFillProfile,
} from 'react-icons/ai';
import { callOpenAI, stopOpenAI } from './openaiApi';
import { useSettings } from '../context/SettingsContext';
import { useConversations, Conversation } from '../context/ConversationContext';
import { ToastContext } from '../context/ToastContext';

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
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const { addToast } = useContext(ToastContext);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (message.trim() !== '') {
      const newConversations = [...conversations];
      let currentMessages: { role: string; content: string }[];

      if (!currentConversation) {
        const newConversation: Conversation = { id: Date.now(), messages: [] };
        newConversations.unshift(newConversation);
        setCurrentConversation(newConversation);
        currentMessages = newConversation.messages;
      } else {
        currentMessages = currentConversation.messages;
      }
      currentMessages.push({ role: 'user', content: message });
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
      if (
        messages.length > 0 &&
        messages[messages.length - 1].role === 'user'
      ) {
        await callOpenAI(messages, settingsRef.current, (response) => {
          if (response.content === '[DONE]') {
            setIsGenerating(false);
          } else {
            if (messages[messages.length - 1].role === 'assistant') {
              messages[messages.length - 1].content += response.content;
            } else {
              messages.push(response);
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
          }
        });
      }
    };

    if (isGenerating) {
      callApi();
    }
  }, [currentConversation, setConversations, isGenerating]);

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

  return (
    <footer className="text-center">
      <div>
        <form onSubmit={handleSubmit}>
          <div className="flex items-center px-3 py-2 rounded-lg bg-neutral transition ease-in-out duration-500">
            <div
              className="tooltip tooltip-bottom tooltip-accent"
              data-tip="Coming Soon"
            >
              <button
                id="speeddial"
                type="button"
                className="btn btn-circle btn-ghost mr-3"
              >
                <AiFillProfile className="w-6 h-6 text-secondary" />
              </button>
            </div>
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
            <button
              id="sendBtn"
              type="submit"
              className="btn btn-circle btn-ghost mx-3"
            >
              <AiOutlineSend className="w-6 h-6 text-secondary" />
            </button>

            <button
              type="button"
              id="stopBtn"
              disabled={!isGenerating}
              onClick={handleStop}
              className="btn btn-circle btn-ghost mx-3 hover:translate-x-5 disabled:cursor-not-allowed"
            >
              <AiFillCloseCircle className="w-6 h-6 text-error" />
            </button>
          </div>
        </form>
      </div>
    </footer>
  );
}

export default ChatInput;
