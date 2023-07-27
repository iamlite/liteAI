import React, { useEffect, useState, useContext, SetStateAction, createContext, ReactNode, Dispatch } from 'react';
import { img } from '../img';
import presetPrompts from '@config/presetPrompts';

export const defaultSettings = {
  openAIKey: '',
  maxTokens: 512,
  modelName: 'gpt-3.5-turbo',
  endpointURL: 'https://api.openai.com/v1/chat/completions',
  imageGenEndpointURL: 'https://api.openai.com/v1/images/generations',
  temperature: 0.5,
  presencePenalty: 0,
  frequencyPenalty: 0,
  userAvatar: img.userav,
  assistantAvatar: img.sysav,
  initialPrompt: presetPrompts[0].content,
};

type SettingsState = {
  settings: typeof defaultSettings;
  setSettings: Dispatch<SetStateAction<typeof defaultSettings>>;
};

const defaultSettingsState: SettingsState = {
  settings: defaultSettings,
  setSettings: () => {},
};

const SettingsContext = createContext(defaultSettingsState);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const loadedSettings = window.electron.ipcRenderer.store.get('settings');
  const [settings, setSettings] = useState(loadedSettings ? loadedSettings : defaultSettings);

  useEffect(() => {
    window.electron.ipcRenderer.store.set('settings', settings);
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
