import React from 'react';
import { createRoot } from 'react-dom/client';
import Application from '@components/Application';
import { SettingsProvider } from '@context/SettingsContext';
import { ToastProvider } from '@context/ToastContext';
import { ThemeProvider } from '@context/ThemeContext';
import { ConversationProvider } from '@context/ConversationContext';
import { TiktokenProvider } from '@context/TiktokenContext';


const app = (
    <SettingsProvider>
      <TiktokenProvider>
        <ConversationProvider>
          <ToastProvider>
            <ThemeProvider>
              <Application />
            </ThemeProvider>
          </ToastProvider>
        </ConversationProvider>
      </TiktokenProvider>
    </SettingsProvider>
);

createRoot(document.getElementById('app')).render(app);
