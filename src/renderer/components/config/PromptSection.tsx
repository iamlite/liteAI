import React, { useContext, useEffect, useState } from 'react';
import { AiFillSave, AiFillDelete } from 'react-icons/ai';
import presetPrompts from './presetPrompts';
import { ToastContext } from '../context/ToastContext';

interface Settings {
  initialPrompt: string;
}

interface Props {
  settings: Settings;
  handleInputChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

interface Prompt {
  name: string;
  content: string;
}

export default function PromptSettings({ settings, handleInputChange }: Props) {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [customPromptName, setCustomPromptName] = useState('');
  const { addToast } = useContext(ToastContext);

  useEffect(() => {
    const customPrompts: Prompt[] =
      window.electron.ipcRenderer.store.get('customPrompts') || [];
    setPrompts([...presetPrompts, ...customPrompts]);
  }, []);

  const handleSavePrompt = () => {
    const newPrompt: Prompt = {
      name: customPromptName,
      content: settings.initialPrompt,
    };

    const customPrompts: Prompt[] = prompts.filter(
      (prompt) => !presetPrompts.includes(prompt)
    );
    const updatedCustomPrompts: Prompt[] = [...customPrompts, newPrompt];

    window.electron.ipcRenderer.store.set(
      'customPrompts',
      updatedCustomPrompts
    );
    setPrompts([...presetPrompts, ...updatedCustomPrompts]);
    setCustomPromptName('');
  };

  const handlePromptClick = (prompt: Prompt) => {
    handleInputChange({
      target: { name: 'initialPrompt', value: prompt.content },
    } as React.ChangeEvent<HTMLTextAreaElement>);
    setCustomPromptName(prompt.name);
  };

  const handleDeletePrompt = (index: number) => {
    const updatedPrompts: Prompt[] = prompts.filter((_, i) => i !== index);
    window.electron.ipcRenderer.store.set('customPrompts', updatedPrompts);
    setPrompts(updatedPrompts);
    addToast('Prompt deleted successfully!', 'success');
  };

  return (
    <>
      <h2 className="pt-10 text-xl font-bold text-center">Prompt Settings</h2>
      <hr className="my-12 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:opacity-50" />
      <div className="flex flex-col items-center justify-center h-full rounded-3xl transition duration-500 ease-in-out">
        <div className="flex flex-row w-full">
          <div className="w-1/3 px-2 mb-6">
            <div className="p-4 shadow rounded-lg overflow-y-auto h-96 scroll-smooth overscroll-auto scrollbar-thin scrollbar-thumb-rounded-xl">
              {prompts.map((prompt, index) => (
                <div
                  key={prompt.name}
                  className="flex justify-between items-center place-items-center"
                >
                  <button
                    type="button"
                    className="w-full p-2 mb-2 btn-primary rounded-lg hover:-translate-x-4 transition duration-300"
                    onClick={() => handlePromptClick(prompt)}
                  >
                    {prompt.name}
                  </button>
                  <button
                    type="button"
                    className="flex ml-2 p-2 rounded-lg bg-error opacity-50 hover:opacity-100 transition-opacity duration-300"
                    onClick={() => handleDeletePrompt(index)}
                  >
                    <AiFillDelete className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full sm:w-2/3 px-2 mb-4 flex flex-col">
            <div className="p-4 shadow rounded-lg flex-grow flex flex-col">
              <div className="flex items-center mb-4">
                <div className="relative z-0 w-full group">
                  <input
                    value={customPromptName}
                    onChange={(e) => setCustomPromptName(e.target.value)}
                    className="block py-2.5 px-0 w-full text-sm bg-transparent border-b-2 outline-none appearance-nonefocus:outline-none focus:ring-0 focus:border-primary peer"
                    placeholder=" "
                  />
                  <label
                    htmlFor="customPromptName"
                    className="peer-focus:font-medium absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Prompt Title:
                  </label>
                </div>
                <button
                  type="button"
                  className="btn btn-outline btn-base-content ml-5 transition duration-300"
                  onClick={handleSavePrompt}
                >
                  <AiFillSave className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-grow mb-4 relative">
                <div className="block text-sm font-medium">Custom Prompt:</div>
                <textarea
                  name="initialPrompt"
                  value={settings.initialPrompt}
                  onChange={handleInputChange}
                  className="textarea textarea-bordered block resize-none outline-none focus:outline-none bg-base-200 absolute top-0 bottom-0 left-0 right-0"
                  placeholder="Initial Prompt"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
