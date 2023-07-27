import React, { ChangeEvent, useState } from 'react';
import { Combobox } from '@headlessui/react';
import { useSettings } from '@components/context/SettingsContext';

const modelNames = ['gpt-3.5-turbo', 'gpt-3.5-turbo-16k', 'gpt-4'];

export default function GeneralSectionComponent() {
  const { settings, setSettings } = useSettings();
  const [selectedModel, setSelectedModel] = useState(settings.modelName);
  const [query, setQuery] = useState('');

  const filteredModels =
    query === ''
      ? modelNames
      : modelNames.filter((model) => {
          return model.toLowerCase().includes(query.toLowerCase());
        });

        const handleComboboxChange = (value: string) => {
          setSelectedModel(value);
          
          setSettings((prevSettings) => ({
            ...prevSettings,
            modelName: value,
          }));
        };
        

const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
  const { name, value } = event.target;
  
  setSettings((prevSettings) => ({
    ...prevSettings,
    [name]: value,
  }));
};


  return (
    <>
      <h2 className="pt-10 text-xl font-bold text-center">General Settings</h2>
      <hr className="my-12 h-px border-t-0 bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:opacity-50" />
      {/* Blah */}
      <div className="flex flex-col items-center justify-center h-full">
        {/* blah */}
        <div className="flex flex-row w-full -mx-2">
          <div className="w-full md:w-3/4 px-2 mb-6">
            <div className="relative items-center">
              <Combobox value={selectedModel} onChange={handleComboboxChange}>
                <Combobox.Input
                  className="block py-2.5 px-0 w-full text-sm bg-transparent border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder=" "
                />
                <label className="peer-focus:font-medium absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Model Name:
                </label>
                <Combobox.Options>
                  {filteredModels.map((model) => (
                    <Combobox.Option key={model} value={model}>
                      {model}
                    </Combobox.Option>
                  ))}
                </Combobox.Options>
              </Combobox>
            </div>
          </div>
          <div className="w-full md:w-1/4 px-2 mb-6">
            <div className="relative z-0 w-full group">
              <input
                name="maxTokens"
                type="number"
                value={settings.maxTokens}
                onChange={handleInputChange}
                className="block py-2.5 px-0 w-full text-sm bg-transparent border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer"
                placeholder=" "
              />
              <label
                htmlFor="maxTokens"
                className="peer-focus:font-medium absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Max Tokens:
              </label>
            </div>
          </div>
        </div>
        {/* blah */}
        <div className="w-full px-2 mb-6">
          <div className="relative z-0 w-full group">
            <input
              name="openAIKey"
              type="text"
              value={settings.openAIKey}
              onChange={handleInputChange}
              className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer"
              placeholder=" "
            />
            <label
              htmlFor="openAIKey"
              className="peer-focus:font-medium absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              OpenAI Key:
            </label>
          </div>
        </div>
        {/* blah */}
      </div>
    </>
  );
}
