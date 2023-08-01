import React, { ChangeEvent, useState, useRef, useEffect } from 'react';
import { useSettings } from '@components/context/SettingsContext';
import { BiUserCircle, BiCodeBlock } from 'react-icons/bi';

const modelNames = ['gpt-3.5-turbo', 'gpt-3.5-turbo-16k', 'gpt-4'];

export default function GeneralSectionComponent() {
  const { settings, setSettings } = useSettings();
  const [selectedModel, setSelectedModel] = useState(settings.modelName);
  const [inputFocused, setInputFocused] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const wrapperRef = useRef(null);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));

    if (name === "modelName") {
      setSelectedModel(value);
    }
  };

  const handleFocus = () => {
    setInputFocused(true);
  };

  const handleBlur = () => {
    setInputFocused(false);
  };

  const handleModelSelect = (model: string): void => {
    setSelectedModel(model);
    setSettings((prevSettings) => ({
      ...prevSettings,
      modelName: model,
    }));
    setDropdownOpen(false);
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleClickOutside = (event: MouseEvent): void => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <h2 className="pt-10 text-xl font-bold text-center">General Settings</h2>
      <hr className="my-12 h-px border-t-0 bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25" />
      <div className="flex flex-col items-center justify-center h-full">
        <div className="grid grid-cols-[1fr,3fr] gap-4 w-full -mx-2">
          <div>
            <label htmlFor="modelName" className="block mb-1 text-sm font-medium">Model Name:</label>
            <p className="text-xs text-neutral">Select a model or enter a custom model name.</p>
          </div>

          <div className="relative flex py-3" ref={wrapperRef}>
            <span className="inline-flex items-center px-5 text-sm bg-base-200 rounded-l-xl">
              <BiCodeBlock />
            </span>
            <input
              name="modelName"
              value={selectedModel}
              onChange={handleInputChange}
              onFocus={toggleDropdown}
              className="rounded-none rounded-r-lg bg-base-100 text-sm p-2.5 focus:outline-none"
              placeholder="Choose a model..."
            />
            {dropdownOpen && (
              <div className="absolute bottom-[3.5rem] left-0 mt-2 p-3 bg-base-100 rounded-xl shadow-lg">
                {modelNames.map((model) => (
                  <div key={model} onClick={() => handleModelSelect(model)} className="p-3 mx-3 hover:bg-base-200 rounded-xl cursor-pointer">
                    {model}
                  </div>
                ))}
              </div>
            )}
          </div>


          <div>
            <label htmlFor="maxTokens" className="block mb-2 text-sm font-medium">Max Tokens:</label>
            <p className="text-xs text-neutral">This specifies the maximum number of tokens to generate per message.</p>
          </div>
          <div className="flex py-3">
            <span className="inline-flex items-center px-5 text-sm bg-base-200 rounded-l-xl">
              <BiUserCircle />
            </span>
            <input
              name="maxTokens"
              type="number"
              value={settings.maxTokens}
              onChange={handleInputChange}
              className="rounded-none rounded-r-lg bg-base-100 text-sm p-2.5 focus:outline-none"
              placeholder="Max tokens..."
            />
          </div>
          <div>
            <label htmlFor="openAIKey" className="block mb-2 text-sm font-medium">OpenAI Key:</label>
            <p className="text-xs text-neutral">Enter your OpenAI API Key.</p>
          </div>
          <div className="flex py-3">
            <span className="inline-flex items-center px-5 text-sm bg-base-200 rounded-l-xl">
              <BiUserCircle />
            </span>
            <input
              name="openAIKey"
              type="text"
              value={inputFocused ? settings.openAIKey : "*".repeat(settings.openAIKey.length)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleInputChange}
              className="rounded-none rounded-r-lg bg-base-100 block flex-1 min-w-0 w-full text-sm p-2.5 focus:outline-none"
              placeholder="OpenAI Key..."
            />
          </div>

        </div>
      </div>
    </>
  );
}
