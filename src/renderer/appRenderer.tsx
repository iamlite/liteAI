import React from 'react';
import { createRoot } from 'react-dom/client';
import Application from '@components/Application';
import { SettingsProvider } from './components/context/SettingsContext';
import { ToastProvider } from './components/context/ToastContext';
import { ThemeProvider } from './components/context/ThemeContext';
import { ConversationProvider } from './components/context/ConversationContext';
import { TiktokenProvider } from './components/context/TiktokenContext';

const app = (

  <TiktokenProvider>
    <ConversationProvider>
      <ToastProvider>
        <SettingsProvider>
          <ThemeProvider>
            <Application />
          </ThemeProvider>
        </SettingsProvider>
      </ToastProvider>
    </ConversationProvider>
  </TiktokenProvider>

);

createRoot(document.getElementById('app')).render(app);
