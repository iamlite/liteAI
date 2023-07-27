import React, { useContext, useEffect, useState, useRef } from 'react';
import { AiFillSave, AiFillDelete, AiFillCaretRight, AiFillEdit } from 'react-icons/ai';
import presetPrompts from './presetPrompts';
import { ToastContext } from '../context/ToastContext';
import { useSettings } from '../context/SettingsContext'; // make sure to import useSettings from your context file

interface Prompt {
  name: string;
  content: string;
}

export default function PromptSettings() {
  const { settings, setSettings } = useSettings(); // call useSettings
  const [customPrompts, setCustomPrompts] = useState<Prompt[]>([]);
  const [deletedPresetPrompts, setDeletedPresetPrompts] = useState<string[]>([]);
  const [customPromptName, setCustomPromptName] = useState('');
  const [editPromptOriginalName, setEditPromptOriginalName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);
  const { addToast } = useContext(ToastContext);

  useEffect(() => {
    const customPrompts: Prompt[] =
      window.electron.ipcRenderer.store.get('customPrompts') || [];
    setCustomPrompts(customPrompts);

    const deletedPrompts: string[] =
      window.electron.ipcRenderer.store.get('deletedPresetPrompts') || [];
    setDeletedPresetPrompts(deletedPrompts);
  }, []);

  useEffect(() => {
    if (isCreating) {
      inputRef.current.focus();
    }
  }, [isCreating]);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { target } = event;
    const value = target.value;
    const { name } = target;

    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));
  };

  const handleCreatePrompt = () => {
    setIsCreating(true);
    setIsEditing(false);
    setCustomPromptName('');
    handleInputChange({
      target: { name: 'initialPrompt', value: '' },
    } as React.ChangeEvent<HTMLTextAreaElement>);
  };

  const handleEditPrompt = (prompt: Prompt) => {
    setIsCreating(true);
    setIsEditing(true);
    setEditPromptOriginalName(prompt.name);
    setCustomPromptName(prompt.name);
    handleInputChange({
      target: { name: 'initialPrompt', value: prompt.content },
    } as React.ChangeEvent<HTMLTextAreaElement>);
  };
  
  const handleDuplicatePrompt = (prompt: Prompt) => {
    setIsCreating(true);
    setIsEditing(false);
    setCustomPromptName(prompt.name);
    handleInputChange({
      target: { name: 'initialPrompt', value: prompt.content },
    } as React.ChangeEvent<HTMLTextAreaElement>);
  };

  const handleSavePrompt = () => {
    if (customPromptName.trim() === '' || settings.initialPrompt.trim() === '') {
      addToast('Title and content cannot be empty!', 'error');
      return;
    }

    if (!isEditing && presetPrompts.concat(customPrompts).some((prompt) => prompt.name === customPromptName)) {
      addToast('Prompt with the same title already exists!', 'error');
      return;
    }
  
    const newPrompt: Prompt = {
      name: customPromptName,
      content: settings.initialPrompt,
    };
  
    let updatedCustomPrompts: Prompt[];
  
    if (isEditing) {
      updatedCustomPrompts = customPrompts.map((prompt) =>
        prompt.name === editPromptOriginalName ? newPrompt : prompt
      );
    } else {
      updatedCustomPrompts = [...customPrompts, newPrompt];
    }
  

    window.electron.ipcRenderer.store.set(
      'customPrompts',
      updatedCustomPrompts
    );
    setCustomPrompts(updatedCustomPrompts);
    setCustomPromptName('');
    setIsCreating(false);
    setIsEditing(false);

    addToast('Prompt saved successfully!', 'success');
  };

  const handlePromptClick = (prompt: Prompt) => {
    handleInputChange({
      target: { name: 'initialPrompt', value: prompt.content },
    } as React.ChangeEvent<HTMLTextAreaElement>);
    setCustomPromptName(prompt.name);
    setIsCreating(false);
    setIsEditing(false);
    setEditPromptOriginalName('');
  };

  const handleDeletePrompt = (prompt: Prompt) => {
    if (presetPrompts.includes(prompt)) {
      const updatedDeletedPresetPrompts: string[] = [...deletedPresetPrompts, prompt.name];
      window.electron.ipcRenderer.store.set('deletedPresetPrompts', updatedDeletedPresetPrompts);
      setDeletedPresetPrompts(updatedDeletedPresetPrompts);
    } else {
      const updatedPrompts: Prompt[] = customPrompts.filter((p) => p !== prompt);
      window.electron.ipcRenderer.store.set('customPrompts', updatedPrompts);
      setCustomPrompts(updatedPrompts);
    }

    addToast('Prompt deleted successfully!', 'success');
  };

  const handleRestorePresets = () => {
    window.electron.ipcRenderer.store.set('deletedPresetPrompts', []);
    setDeletedPresetPrompts([]);
    addToast('Preset prompts restored!', 'success');
  };

  const filterDeletedPresetPrompts = (prompts: Prompt[]) => {
    return prompts.filter((prompt) => !deletedPresetPrompts.includes(prompt.name));
  }

  return (
    <>
      <h2 className="pt-10 text-xl font-bold text-center">Prompt Settings</h2>
      <hr className="my-12 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:opacity-50" />
      <div className="flex flex-col items-center justify-center h-full rounded-3xl transition duration-500 ease-in-out">
        <div className="flex flex-row w-full">
          <div className="w-1/3 px-2 mb-6">
            <button
              type="button"
              className="btn btn-block btn-secondary mb-4"
              onClick={handleCreatePrompt}
            >
              <AiFillCaretRight className="w-4 h-4" />
              Create Prompt
            </button>
            <div className="p-4 shadow rounded-lg overflow-y-auto h-96 scroll-smooth overscroll-auto scrollbar-thin scrollbar-thumb-rounded-xl">
              {filterDeletedPresetPrompts(presetPrompts.concat(customPrompts)).map((prompt) => (
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
                    onClick={() => handleDeletePrompt(prompt)}
                  >
                    <AiFillDelete className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            {deletedPresetPrompts.length > 0 && (
              <button
                type="button"
                className="btn btn-block btn-sm btn-outline btn-base-content opacity-20 hover:opacity-100 duration-300"
                onClick={handleRestorePresets}
              >
                Restore Presets
              </button>
            )}
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
                    disabled={!isCreating}
                    ref={inputRef}
                  />
                  <label
                    htmlFor="customPromptName"
                    className="peer-focus:font-medium absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Prompt Title:
                  </label>
                </div>
                {isCreating && (
                  <button
                    type="button"
                    className="btn btn-outline btn-base-content ml-5 transition duration-300"
                    onClick={handleSavePrompt}
                  >
                    <AiFillSave className="w-5 h-5" />
                  </button>
                )}
              </div>
              <div className="flex-grow mb-4 relative">
                <div className="block text-sm font-medium">Custom Prompt:</div>
                <textarea
                  name="initialPrompt"
                  value={settings.initialPrompt}
                  onChange={handleInputChange}
                  className="textarea textarea-bordered block resize-none outline-none focus:outline-none bg-base-200 absolute top-0 bottom-0 left-0 right-0"
                  placeholder="Initial Prompt"
                  disabled={!isCreating}
                />
                {!isCreating && (
                  <div className="flex gap-4 absolute -bottom-6 right-4">
                    {!presetPrompts.some((prompt) => prompt.name === customPromptName) && (
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs"
                        onClick={() => handleEditPrompt({ name: customPromptName, content: settings.initialPrompt })}
                      >
                        <AiFillEdit />
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn btn-ghost btn-xs"
                      onClick={() => handleDuplicatePrompt({ name: customPromptName, content: settings.initialPrompt })}
                    >
                      Duplicate
                    </button>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

