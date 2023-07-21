import React from 'react';
import { icons } from '../Icons';


export const defaultSettings = {
  openAIKey: '',
  maxTokens: 512,
  modelName: 'gpt-3.5-turbo',
  endpointURL: 'https://api.openai.com/v1/chat/completions',
  imageGenEndpointURL: 'https://api.openai.com/v1/images/generations',
  temperature: 0.5,
  presencePenalty: 0,
  frequencyPenalty: 0,
  userAvatar: icons.avatar,
  assistantAvatar: icons.avatar,
  initialPrompt: 'You are a helpful Assistant',
};

type SettingsState = {
  settings: typeof defaultSettings;
  setSettings: React.Dispatch<React.SetStateAction<typeof defaultSettings>>;
};

const defaultSettingsState: SettingsState = {
  settings: defaultSettings,
  setSettings: () => {},
};

const SettingsContext = React.createContext(defaultSettingsState);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = React.useState(defaultSettings);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = React.useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
