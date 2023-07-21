import { useNavigate } from 'react-router-dom';
import { HiFire } from 'react-icons/hi2';
import HomeButton from './HomeButton';
import MessagePaneButton from './MessagePaneButton';
import SettingsButton from './SettingsButton';
import DarkModeToggle from './DarkModeToggle';
import ImageButton from './ImageButton';
import React from 'react';

interface SidebarProps {
  toggleChatList: () => void;
}

function Sidebar({ toggleChatList }: SidebarProps) {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const handleimgClick = () => {
    navigate('/img');
  };

  return (
    <div className="flex flex-row pl-5 pb-7 pt-10 flex-grow">
      <div className="flex flex-col px-4 py-10 items-center rounded-3xl bg-primary">
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-secondary">
          <HiFire className="w-10 h-10" />
        </div>

        <ul className="flex flex-col space-y-2 mt-12">
          <HomeButton onClick={handleHomeClick} />
          <MessagePaneButton onClick={toggleChatList} />
          <ImageButton onClick={handleimgClick} />
          <SettingsButton onClick={handleSettingsClick} />
        </ul>
        <DarkModeToggle />
      </div>
    </div>
  );
}

export default Sidebar;
