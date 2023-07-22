import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { getEncoding } from 'js-tiktoken';

interface TiktokenContextType {
  getTokenCount: (text: string) => number;
  getTotalTokens: (messages: string[]) => number;
}

export const TiktokenContext = createContext<TiktokenContextType>({
  getTokenCount: () => 0,
  getTotalTokens: () => 0,
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

  const contextValue = useMemo(
    () => ({ getTokenCount, getTotalTokens }),
    [getTokenCount, getTotalTokens]
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
