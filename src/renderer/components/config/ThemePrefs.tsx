import React from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { AiFillCheckCircle, AiFillCaretDown } from 'react-icons/ai';
import { useTheme, ThemeName, themeNames } from '../context/ThemeContext';

type ThemeDropdownProps = {
  value: ThemeName;
  onChange: (value: ThemeName) => void;
  themes: ThemeName[];
};

function ThemeDropdown({ value, onChange, themes }: ThemeDropdownProps) {
  return (
    <div className="relative">
      <Listbox value={value} onChange={onChange}>
        <Listbox.Button className="btn btn-outline btn-block focus:outline-none sm:text-sm">
          <span className="block truncate">{value}</span>
          <AiFillCaretDown className="w-5 h-5" />
        </Listbox.Button>
        <Transition
          as={React.Fragment}
          leave="transition ease-in-out duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto bg-base-100 rounded-md shadow-lg max-h-60 focus:outline-none sm:text-sm">
            {themes.map((mode) => (
              <Listbox.Option
                key={mode}
                className={({ active }) =>
                  `cursor-default select-none relative py-2 pl-10 pr-4 ${
                    active
                      ? 'bg-primary text-base-content'
                      : 'text-base-content'
                  }`
                }
                value={mode}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? 'font-medium' : 'font-normal'
                      }`}
                    >
                      {mode}
                    </span>
                    {selected && (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <AiFillCheckCircle
                          className="w-5 h-5 text-primary"
                          aria-hidden="true"
                        />
                      </span>
                    )}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </Listbox>
    </div>
  );
}

function ThemePicker() {
  const {
    preferredLightThemeName,
    setPreferredLightThemeName,
    preferredDarkThemeName,
    setPreferredDarkThemeName,
  } = useTheme();

  const handleThemeChange = (isDark: boolean) => (value: ThemeName) => {
    if (isDark) {
      setPreferredDarkThemeName(value);
    } else {
      setPreferredLightThemeName(value);
    }
  };

  const renderThemePicker = (
    isDark: boolean,
    preferredThemeName: ThemeName
  ) => (
    <div>
      <span className="block font-medium text-lg">
        Preferred {isDark ? 'Dark' : 'Light'} Mode:
      </span>
      <ThemeDropdown
        value={preferredThemeName}
        onChange={handleThemeChange(isDark)}
        themes={isDark ? themeNames.dark : themeNames.light}
      />
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-4 items-center justify-center w-full">
      {renderThemePicker(false, preferredLightThemeName)}
      {renderThemePicker(true, preferredDarkThemeName)}
    </div>
  );
}

export default ThemePicker;
