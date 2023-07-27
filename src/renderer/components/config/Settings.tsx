import React, { useEffect, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import ConfirmationDialog from './ConfirmationDialog';
import { ToastContext } from '../context/ToastContext';
import { useTheme, defaultLightTheme, defaultDarkTheme } from '../context/ThemeContext';

import AvatarSectionComponent from './CustomizeSection';
import GeneralSectionComponent from './GeneralSection';
import PromptSettings from './PromptSection';
import {
  useSettings,
  defaultSettings,
} from '../context/SettingsContext';
import AdvancedSection from './AdvancedSection';
import ConsolePooper from './ConsolePooper';

function Settings() {
  const { addToast } = useContext(ToastContext);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { setSettings } = useSettings();
  const [activeTab, setActiveTab] = useState('general');
  const { setPreferredLightThemeName, setPreferredDarkThemeName } = useTheme();

  useEffect(() => {
    const loadedSettings = window.electron.ipcRenderer.store.get('settings');
    if (loadedSettings) {
      setSettings(loadedSettings);
    } else {
      window.electron.ipcRenderer.store.set('settings', defaultSettings);
    }
  }, [setSettings]);

  const handleResetSettings = () => {
    setShowConfirmation(true);
  };

  const handleConfirmReset = () => {
    setSettings(defaultSettings);
    setPreferredLightThemeName(defaultLightTheme);
    setPreferredDarkThemeName(defaultDarkTheme);

    window.electron.ipcRenderer.store.set('settings', defaultSettings);
    addToast('Settings have been reset to default.', 'warning');
    setShowConfirmation(false);
  };

  const handleCancelReset = () => {
    setShowConfirmation(false);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      addToast('Settings saved successfully!', 'success');
    } catch (error) {
      addToast('An error occurred while saving settings.', 'danger');
    }
  };

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
  };


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ width: '100%' }}
    >
        <div className="flex h-screen justify-center items-center overflow-hidden pb-7 pt-10 px-5">
          <div className="flex flex-row p-2 w-full h-full rounded-3xl drop-shadow-lg overflow-hidden border-2 border-base-100 bg-base-300">
            <div className="flex items-center w-1/4">
              <nav className="flex flex-col w-full p-5 space-y-2">
                {['General', 'Customize', 'Prompt', 'Advanced'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => handleTabChange(tab.toLowerCase())}
                    className={`flex flex-grow border-b-2 py-2 px-4 hover:text-primary hover:border-primary transition duration-300
                  cursor-pointer'
                  ${
                    activeTab === tab.toLowerCase()
                      ? 'border-primary'
                      : 'border-transparent'
                  }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            <div className="w-0.5 bg-gradient-to-b from-transparent via-neutral-500 to-transparent opacity-25 dark:opacity-50" />

            {/* Main Content */}
            <div className="flex flex-col w-3/4 p-10 overflow-y-auto overflow-x-hidden scroll-smooth overscroll-auto scrollbar-thin scrollbar-thumb-rounded-xl scrollbar-thumb-primary">
              <form
                onSubmit={handleFormSubmit}
                className="flex-grow flex flex-col"
              >
                {activeTab === 'general' && (
                  <GeneralSectionComponent />
                )}
                {activeTab === 'customize' && (
                  <AvatarSectionComponent />
                )}
                {activeTab === 'prompt' && (
                  <PromptSettings/>
                )}
                {activeTab === 'advanced' && (
                  <AdvancedSection />
                )}

                <div className="flex-grow" />
                <hr className="my-10 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:opacity-50" />
                <div className="flex justify-end space-x-4">
                  <ConsolePooper />
                  <button
                    type="submit"
                    className="btn btn-primary transition ease-in-out duration-300"
                  >
                    Save Settings
                  </button>
                  <button
                    type="button"
                    onClick={handleResetSettings}
                    className="btn btn-secondary transition ease-in-out duration-300"
                  >
                    Reset to Default
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {showConfirmation && (
          <ConfirmationDialog
            message="Are you sure you want to reset the settings?"
            onConfirm={handleConfirmReset}
            onCancel={handleCancelReset}
          />
        )}
    </motion.div>
  );
}
export default Settings;
