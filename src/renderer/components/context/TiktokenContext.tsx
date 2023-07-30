import React, { createContext, useContext, useCallback, useMemo, useEffect } from 'react';
import { getEncoding } from 'js-tiktoken';

interface TiktokenContextType {
  getTokenCount: (text: string) => number;
  getTotalTokens: (messages: string[]) => number;
  incrementTotalTokenUsage: (tokenCount: number) => void;
  getTotalTokenUsage: () => number;
}

export const TiktokenContext = createContext<TiktokenContextType>({
  getTokenCount: () => 0,
  getTotalTokens: () => 0,
  incrementTotalTokenUsage: () => {},
  getTotalTokenUsage: () => 0,
});

interface TiktokenProviderProps {
  children: React.ReactNode;
}

export function TiktokenProvider({
  children,
}: TiktokenProviderProps): React.JSX.Element {
  const enc = useMemo(() => getEncoding('gpt2'), []);

  const getTokenCount = useCallback(
    (text: string) => {
      const tokens = enc.encode(text);
      return tokens.length;
    },
    [enc]
  );

  const getTotalTokens = useCallback(
    (messages: string[]) => {
      return messages.reduce(
        (total, message) => total + getTokenCount(message),
        0
      );
    },
    [getTokenCount]
  );

  const totalTokenUsage = window.electron.ipcRenderer.store.get('stats.totalTokenUsage') || 0;
  let pendingIncrement = 0;

  const writeIncrementToStore = useCallback(() => {
    if (pendingIncrement !== 0) {
      const currentTotalUsage = window.electron.ipcRenderer.store.get('stats.totalTokenUsage') || 0;
      const newTotalUsage = currentTotalUsage + pendingIncrement;
      window.electron.ipcRenderer.store.set('stats.totalTokenUsage', newTotalUsage);
      pendingIncrement = 0;
    }
  }, []);

  const incrementTotalTokenUsage = useCallback((tokenCount: number) => {
    pendingIncrement += tokenCount;
  }, []);
  
  const getTotalTokenUsage = useCallback(() => {
    return totalTokenUsage + pendingIncrement;
  }, [totalTokenUsage, pendingIncrement]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      writeIncrementToStore();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [writeIncrementToStore]);

  const contextValue = useMemo(
    () => ({ getTokenCount, getTotalTokens, incrementTotalTokenUsage, getTotalTokenUsage }),
    [getTokenCount, getTotalTokens, incrementTotalTokenUsage, getTotalTokenUsage]
  );

  return (
    <TiktokenContext.Provider value={contextValue}>
      {children}
    </TiktokenContext.Provider>
  );
}

export const useTiktoken = (): TiktokenContextType => {
  return useContext(TiktokenContext);
};
