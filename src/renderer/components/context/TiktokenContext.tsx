import React, { createContext, useContext, useCallback, useMemo } from 'react';
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

  const incrementTotalTokenUsage = useCallback((tokenCount: number) => {
    const currentTotalUsage = window.electron.ipcRenderer.store.get('stats.totalTokenUsage') || 0;
    window.electron.ipcRenderer.store.set('stats.totalTokenUsage', currentTotalUsage + tokenCount);
  }, []);

  const getTotalTokenUsage = useCallback(() => {
    return window.electron.ipcRenderer.store.get('stats.totalTokenUsage') || 0;
  }, []);

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
