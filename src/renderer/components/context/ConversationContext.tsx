import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
  Key,
} from 'react';

export interface Conversation {
  id: number;
  messages: Array<{ role: string; content: string }>;
}

export interface Message {
  id?: Key;
  role: string;
  content: string;
}

export interface ConversationContextProps {
  conversations: Conversation[];
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
  currentConversation: Conversation | undefined;
  setCurrentConversation: React.Dispatch<
    React.SetStateAction<Conversation | undefined>
  >;
  clearCurrentConversation: () => void;
}

export const ConversationContext = createContext<
  ConversationContextProps | undefined
>(undefined);

interface ConversationProviderProps {
  children: ReactNode;
}

export function ConversationProvider({ children }: ConversationProviderProps) {
  const [currentConversation, setCurrentConversation] = useState<
    Conversation | undefined
  >();
  const [conversations, setConversations] = useState<Conversation[]>([
    { id: Date.now(), messages: [] },
  ]);

  const getInitialConversationsFromLocalStorage = () => {
    const storedConversations = localStorage.getItem('conversations');
    const initialConversations = storedConversations
      ? JSON.parse(storedConversations)
      : [{ id: Date.now(), messages: [] }];

    return initialConversations;
  };

  useEffect(() => {
    const storedConversations =
      window.electron.ipcRenderer.store.get('conversations');
    const initialConversations = storedConversations
      ? JSON.parse(storedConversations)
      : getInitialConversationsFromLocalStorage();

    setConversations(initialConversations);

    if (initialConversations.length > 0) {
      setCurrentConversation(initialConversations[0]);
    }
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.store.set(
      'conversations',
      JSON.stringify(conversations)
    );
    localStorage.setItem('conversations', JSON.stringify(conversations));

    if (
      currentConversation &&
      !conversations.find((c) => c.id === currentConversation.id)
    ) {
      setCurrentConversation(conversations[0]);
    }
  }, [conversations, currentConversation]);

  const clearCurrentConversation = useCallback(() => {
    if (!currentConversation) return;

    const { id: currentConversationId } = currentConversation;

    const newConversations = conversations.filter(
      ({ id }) => id !== currentConversationId
    );

    let newCurrentConversation: Conversation;
    if (newConversations.length > 0) {
      [newCurrentConversation] = newConversations;
    } else {
      newCurrentConversation = { id: Date.now(), messages: [] };
      newConversations.push(newCurrentConversation);
    }

    setConversations(newConversations);
    setCurrentConversation(newCurrentConversation);
  }, [currentConversation, conversations]);

  const value = useMemo(
    () => ({
      conversations,
      setConversations,
      currentConversation,
      setCurrentConversation,
      clearCurrentConversation,
    }),
    [conversations, currentConversation, clearCurrentConversation]
  );

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversations(): ConversationContextProps {
  const context = useContext(ConversationContext);
  if (context === undefined) {
    throw new Error(
      'useConversations must be used within a ConversationProvider'
    );
  }
  return context;
}
