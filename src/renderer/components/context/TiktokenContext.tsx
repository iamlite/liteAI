import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { getEncoding } from 'js-tiktoken';

// Define context type
interface TiktokenContextType {
  getTokenCount: (text: string) => number;
  getTotalTokens: (messages: string[]) => number;
}

// Create Context with default value as an empty object
export const TiktokenContext = createContext<TiktokenContextType>({
  getTokenCount: () => 0,
  getTotalTokens: () => 0,
});

interface TiktokenProviderProps {
  children: React.ReactNode;
}

// Define Provider
export function TiktokenProvider({
  children,
}: TiktokenProviderProps): React.JSX.Element {
  // memoize the 'enc' instance
  const enc = useMemo(() => getEncoding('gpt2'), []);

  // Function to count tokens in a single message
  const getTokenCount = useCallback(
    (text: string) => {
      const tokens = enc.encode(text);
      return tokens.length;
    },
    [enc]
  );

  // Function to count total tokens in an array of messages
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

// Custom hook to use Tiktoken context
export const useTiktoken = (): TiktokenContextType => {
  return useContext(TiktokenContext);
};
