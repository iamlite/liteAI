import React, { ChangeEvent } from 'react';
import { useSettings } from '@components/context/SettingsContext';

type Settings = {
  [K: string]: string | number;
};

function AdvancedSection() {
  const { settings, setSettings } = useSettings() as { settings: Settings, setSettings: React.Dispatch<React.SetStateAction<Settings>> };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { target } = event;
    const value = target.type === 'range' ? parseFloat(target.value) : target.value;
    const { name } = target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));
  };

  const renderRangeInput = (
    name: string,
    label: string,
    color: string,
    min: string,
    max: string
  ) => (
    <div className="flex-1" key={name}>
      <label className="block">
        {label}:{' '}
        <input
          name={name}
          type="range"
          step="0.1"
          min={min}
          max={max}
          value={settings[name]}
          onChange={handleInputChange}
          className={`range mt-1 ${color}`}
        />
        <span className="block text-zinc-500 text-sm mt-1">
          Current: {settings[name]}
        </span>
      </label>
    </div>
  );

  return (
    <>
      <h2 className="pt-10 text-xl font-bold text-center">Advanced Settings</h2>
      <hr className="my-12 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:opacity-50" />

      <div className="flex flex-col justify-center h-full">
        <div className="relative z-0 w-full my-10">
          <input
            name="endpointURL"
            type="text"
            value={settings.endpointURL}
            onChange={handleInputChange}
            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer"
            placeholder=" "
          />
          <label className="peer-focus:font-medium absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            Endpoint URL:
          </label>
        </div>
        <div className="relative z-0 w-full mb-10">
          <input
            name="imageGenEndpointURL"
            type="text"
            value={settings.imageGenEndpointURL}
            onChange={handleInputChange}
            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer"
            placeholder=" "
          />
          <label className="peer-focus:font-medium absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            Image Endpoint URL:
          </label>
        </div>
        <div className="flex flex-wrap gap-4">
          {[
            {
              name: 'temperature',
              label: 'Temperature',
              color: 'range-error',
              min: '0',
              max: '1',
            },
            {
              name: 'presencePenalty',
              label: 'Presence Penalty',
              color: 'range-info',
              min: '-2',
              max: '2',
            },
            {
              name: 'frequencyPenalty',
              label: 'Frequency Penalty',
              color: 'range-success',
              min: '-2',
              max: '2',
            },
          ].map((config) =>
            renderRangeInput(
              config.name,
              config.label,
              config.color,
              config.min,
              config.max
            )
          )}
        </div>
      </div>
    </>
  );
}

export default AdvancedSection;
