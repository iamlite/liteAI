import React, { useContext, ChangeEvent, useEffect } from 'react';
import { AiFillCaretDown } from 'react-icons/ai';
import { ToastContext } from '@context/ToastContext';
import { useSettings } from '@context/SettingsContext';
import { useTheme, ThemeName, themeNames } from '@context/ThemeContext';

function CustomizeSectionComponent() {
  const { addToast } = useContext(ToastContext);
  const { settings, setSettings } = useSettings();
  const {
    preferredLightThemeName,
    setPreferredLightThemeName,
    preferredDarkThemeName,
    setPreferredDarkThemeName,
  } = useTheme();

  useEffect(() => {
    const loadedSettings = window.electron.ipcRenderer.store.get('settings');
    if (loadedSettings) {
      setSettings(loadedSettings);
    }
  }, [setSettings]);

  const handleThemeChange = (isDark: boolean) => (value: ThemeName) => {
    if (isDark) {
      setPreferredDarkThemeName(value);
    } else {
      setPreferredLightThemeName(value);
    }
  };

  const handleAvatarChange = (
    event: ChangeEvent<HTMLInputElement>,
    avatarType: 'userAvatar' | 'assistantAvatar'
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        try {
          const avatarURL = reader.result;
          const avatarURLString =
            typeof avatarURL === 'string'
              ? avatarURL
              : new TextDecoder().decode(avatarURL as ArrayBuffer);
          setSettings((prevSettings) => ({
            ...prevSettings,
            [avatarType]: avatarURLString,
          }));
          window.electron.ipcRenderer.store.set(
            `settings.${avatarType}`,
            avatarURLString
          );
          addToast(`${avatarType} avatar updated successfully!`, 'success');
        } catch (error) {
          addToast(
            `An error occurred while updating ${avatarType} avatar.`,
            'danger'
          );
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>,
    avatarType: 'userAvatar' | 'assistantAvatar'
  ) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        try {
          const avatarURL = reader.result;
          const avatarURLString =
            typeof avatarURL === 'string'
              ? avatarURL
              : new TextDecoder().decode(avatarURL as ArrayBuffer);
          setSettings((prevSettings) => ({
            ...prevSettings,
            [avatarType]: avatarURLString,
          }));
          window.electron.ipcRenderer.store.set(
            `settings.${avatarType}`,
            avatarURLString
          );
          addToast(`${avatarType} avatar updated successfully!`, 'success');
        } catch (error) {
          addToast(
            `An error occurred while updating ${avatarType} avatar.`,
            'danger'
          );
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const renderAvatarPicker = (avatarType: 'userAvatar' | 'assistantAvatar') => (
    <>
      <div className='flex flex-col justify-center items-start'>
        <label htmlFor={`${avatarType}Input`} className="block mb-1 text-sm font-medium">
          {avatarType === 'userAvatar' ? 'User Avatar:' : 'Assistant Avatar:'}
        </label>
        <p className="text-xs text-neutral">Customize the {avatarType === 'userAvatar' ? 'user avatar' : 'assistant avatar'}.</p>
      </div>

      <div className="w-full items-center" onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, avatarType)} >
        
        <div className="my-3 py-2 flex flex-row justify-center items-center bg-base-200 rounded-2xl">
          <div className="px-10">
            <label
              htmlFor={`${avatarType}Input`}
              className="flex flex-col items-center justify-center w-full h-fit border-2 border-dashed border-base-300 bg-base-100 rounded-lg cursor-pointer transition ease-in-out duration-500 hover:scale-110"
            >
              <div className="flex flex-col items-center justify-center p-5">
              <img src={settings[avatarType]} alt={avatarType === 'userAvatar' ? 'User Avatar' : 'Assistant Avatar'} className="avatar mask mask-squircle h-16 w-16 my-2" />
                <p className="mb-2 text-sm text-base-content">Click to upload or drag and drop </p>
              </div>

              <input
                id={`${avatarType}Input`}
                type="file"
                accept="image/*"
                onChange={(event) => handleAvatarChange(event, avatarType)}
                className="hidden"
              />
            </label>
          </div>
        </div>

      </div>
    </>
  );

  return (
    <>
      <h2 className="pt-5 text-xl font-bold text-center">Customize Your Experience</h2>
      <hr className="my-12 h-px border-t-0 bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25" />
      <div className="flex flex-col items-center justify-center h-full">
        <div className="grid grid-cols-[1fr,3fr] w-full">
          {renderAvatarPicker('userAvatar')}
          {renderAvatarPicker('assistantAvatar')}
          <div className='flex flex-col justify-center items-start'>
            <label htmlFor="lightModeInput" className="block mb-1 text-sm font-medium">
              Preferred Light Mode:
            </label>
            <p className="text-xs text-neutral">Select a theme for light mode.</p>
          </div>
          <div className="dropdown dropdown-top w-full">
            <label tabIndex={0} className="btn btn-neutral m-1 btn-block">
              <span className="block truncate">{preferredLightThemeName}</span>
              <AiFillCaretDown className="w-5 h-5" />
            </label>
            <ul tabIndex={0} className="dropdown-content flex flex-col z-[1] menu p-2 shadow bg-base-100 rounded-box max-h-[500%] w-full overflow-y-auto">
              {themeNames.light.map((mode) => (
                <li key={mode}>
                  <a className="block truncate" onClick={() => handleThemeChange(false)(mode)}>
                    {mode}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className='flex flex-col justify-center items-start'>
            <label htmlFor="darkModeInput" className="block mb-1 text-sm font-medium">
              Preferred Dark Mode:
            </label>
            <p className="text-xs text-neutral">Select a theme for dark mode.</p>
          </div>
          <div className="dropdown dropdown-top w-full">
            <label tabIndex={0} className="btn btn-neutral m-1 btn-block">
              <span className="block truncate">{preferredDarkThemeName}</span>
              <AiFillCaretDown className="w-5 h-5" />
            </label>
            <ul tabIndex={0} className="dropdown-content flex flex-col z-[1] menu p-2 shadow bg-base-100 rounded-box max-h-[500%] w-full overflow-y-auto">
              {themeNames.dark.map((mode) => (
                <li key={mode}>
                  <a className="block truncate" onClick={() => handleThemeChange(true)(mode)}>
                    {mode}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default CustomizeSectionComponent;
