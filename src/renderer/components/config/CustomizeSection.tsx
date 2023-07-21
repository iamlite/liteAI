import React, { useContext, ChangeEvent } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { ToastContext } from '../context/ToastContext';
import ThemePicker from './ThemePrefs';

interface Avatars {
  userAvatar: string;
  assistantAvatar: string;
}

interface AvatarSectionProps {
  avatars: Avatars;
  setAvatars: React.Dispatch<React.SetStateAction<Avatars>>;
}

function AvatarSectionComponent({ avatars, setAvatars }: AvatarSectionProps) {
  const { addToast } = useContext(ToastContext);

  const handleAvatarChange = (
    event: ChangeEvent<HTMLInputElement>,
    avatarType: keyof Avatars
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
          setAvatars((prevAvatars) => ({
            ...prevAvatars,
            [avatarType]: avatarURLString,
          }));
          localStorage.setItem(`${avatarType}URL`, avatarURLString);
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
    avatarType: keyof Avatars
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
          setAvatars((prevAvatars) => ({
            ...prevAvatars,
            [avatarType]: avatarURLString,
          }));
          localStorage.setItem(`${avatarType}URL`, avatarURLString);
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

  const renderDropzone = (avatarType: keyof Avatars) => (
    <div
      className="w-1/2 items-center p-4"
      key={avatarType}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => handleDrop(e, avatarType)}
    >
      <div className="mb-6 flex flex-col items-center">
        <label htmlFor={`${avatarType}Input`} className="cursor-pointer">
          {avatarType === 'userAvatar' ? 'User Avatar:' : 'Assistant Avatar:'}
        </label>
        <img
          src={avatars[avatarType]}
          alt={avatarType === 'userAvatar' ? 'User Avatar' : 'Assistant Avatar'}
          className="h-12 w-12 my-3 rounded-full"
        />
        <div className="relative">
          <label
            htmlFor={`${avatarType}Input`}
            className="flex flex-col items-center justify-center w-full h-fit border-2 border-dashed rounded-lg cursor-pointer transition ease-in-out duration-500 hover:bg-primary"
          >
            <div className="flex flex-col items-center justify-center p-5">
              <AiOutlineCloudUpload className="w-8 h-8 mb-4" />
              <p className="mb-2 text-sm">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
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
  );

  return (
    <>
      <h2 className="pt-10 text-xl font-bold text-center">
        Customize Your Experience
      </h2>
      <hr className="my-12 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:opacity-50" />
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="pb-10 text-xl font-bold text-center">Theme Settings</h2>
        <ThemePicker />
        <h2 className="pt-10 text-xl font-bold text-center">Avatar Settings</h2>
        <div className="flex flex-row w-full -mx-2">
          {['userAvatar', 'assistantAvatar'].map(renderDropzone)}
        </div>
      </div>
    </>
  );
}

export default AvatarSectionComponent;
