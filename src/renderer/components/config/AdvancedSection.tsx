import React, { ChangeEvent, FC } from 'react';
import { useSettings } from '@components/context/SettingsContext';
import { AiOutlineLink , AiOutlineUserAdd } from 'react-icons/ai';
import { BiImageAdd } from 'react-icons/bi';
import { GiThermometerHot, GiLightningFrequency } from 'react-icons/gi';

type Settings = {
  [K: string]: string | number;
};

interface InputProps {
  name: string;
  value: string | number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const TextInput: FC<InputProps> = ({ name, value, onChange, placeholder }) => (
  <div className="relative flex py-3">
    <span className="inline-flex items-center px-5 text-sm bg-base-200 rounded-l-xl">
      {name === 'endpointURL' && <AiOutlineLink />}
      {name === 'imageGenEndpointURL' && <BiImageAdd />}
    </span>
    <input
      name={name}
      type="text"
      value={value as string}
      onChange={onChange}
      className="rounded-none rounded-r-lg bg-base-100 text-sm p-2.5 focus:outline-none w-full"
      placeholder={placeholder || ' '}
    />
  </div>
);

interface RangeInputProps extends InputProps {
  min: number;
  max: number;
  step: number;
  className: string;
}

const RangeInput: FC<RangeInputProps> = ({ name, value, onChange, min, max, step, className }) => (
  <div className="relative flex pt-5 flex-col">
    <div className="flex">
      <span className="inline-flex items-center px-5 text-sm bg-base-200 rounded-l-xl" style={{ zIndex: 1, position: 'relative' }}>
        {name === 'temperature' && <GiThermometerHot />}
        {name === 'presencePenalty' && <AiOutlineUserAdd />}
        {name === 'frequencyPenalty' && <GiLightningFrequency />}
      </span>
      <input
        name={name}
        type="range"
        step={step}
        min={min}
        max={max}
        value={value as number}
        onChange={onChange}
        className={`range ${className} range-lg`}
        style={{ zIndex: 0, position: 'relative', left: '-10px' }}
      />
    </div>
    <div className="text-neutral text-sm text-right w-full pt-1 pr-4">Current: {value}</div>
  </div>
);

function AdvancedSection() {
  const { settings, setSettings } = useSettings() as {
    settings: Settings;
    setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { target } = event;
    const value = target.type === 'range' ? parseFloat(target.value) : target.value;
    const { name } = target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));
  };

  return (
    <>
      <h2 className="pt-10 text-xl font-bold text-center">General Settings</h2>
      <hr className="my-12 h-px border-t-0 bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25" />
      <div className="flex flex-col items-center justify-center h-full">
        <div className="grid grid-cols-[1fr,3fr] gap-4 w-full -mx-2">
          <div className='flex flex-col justify-center items-start'>
            <label htmlFor="endpointURL" className="block mb-1 text-sm font-medium">
              Endpoint URL:
            </label>
            <p className="text-xs text-neutral">Text Generation Endpoint URL.</p>
          </div>
          <TextInput name="endpointURL" value={settings.endpointURL} onChange={handleInputChange} />

          <div className='flex flex-col justify-center items-start'>
            <label htmlFor="imageGenEndpointURL" className="block mb-1 text-sm font-medium">
              Image Endpoint URL:
            </label>
            <p className="text-xs text-neutral">Image generation endpoint URL.</p>
          </div>
          <TextInput name="imageGenEndpointURL" value={settings.imageGenEndpointURL} onChange={handleInputChange} />

          <div className='flex flex-col justify-center items-start'>
            <label className="block mb-1 text-sm font-medium">Temperature:</label>
            <p className="text-xs text-neutral">Controls the randomness of the generated text.</p>
          </div>
          <RangeInput name="temperature" value={settings['temperature']} min={0} max={1} step={0.1} onChange={handleInputChange} className="range-error" />

          <div className='flex flex-col justify-center items-start'>
            <label className="block mb-1 text-sm font-medium">Presence Penalty:</label>
            <p className="text-xs text-neutral">Controls the penalty for new tokens.</p>
          </div>
          <RangeInput name="presencePenalty" value={settings['presencePenalty']} min={-2} max={2} step={0.1} onChange={handleInputChange} className="range-info" />

          <div className='flex flex-col justify-center items-start'>
            <label className="block mb-1 text-sm font-medium">Frequency Penalty:</label>
            <p className="text-xs text-neutral">Controls the penalty for frequently used tokens.</p>
          </div>
          <RangeInput name="frequencyPenalty" value={settings['frequencyPenalty']} min={-2} max={2} step={0.1} onChange={handleInputChange} className="range-success" />

        </div>
      </div>
    </>
  );
}

export default AdvancedSection;
