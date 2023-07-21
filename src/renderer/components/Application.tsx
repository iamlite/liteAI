import React, { useEffect, useState } from 'react';
import {
	MemoryRouter as Router,
	Routes,
	Route,
	useLocation,
} from 'react-router-dom';
import Titlebar from '@misc/window/Titlebar';
import { AnimatePresence, motion } from 'framer-motion';
import { useSettings } from './context/SettingsContext';
import { useTheme, themeNames } from './context/ThemeContext';
import Sidebar from './common/Sidebar';
import MainContent from './main/MainContent';
import ImgMainContent from './image/ImgMainContent';
import Settings from './config/Settings';
import ChatList from './main/ChatList';
import Loading from './Load';
import './Application.css';

function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
	const location = useLocation();

	return (
		<AnimatePresence mode='wait'>
			<Routes location={location} key={location.pathname}>
				{children}
			</Routes>
		</AnimatePresence>
	);
}

function App() {
	const { setSettings } = useSettings();
	const [isLoading, setIsLoading] = useState(true);
	const { theme } = useTheme();
	const [isChatListOpen, setIsChatListOpen] = useState(false);

	useEffect(() => {
		const loadedSettings = window.electron.ipcRenderer.store.get('settings');
		if (loadedSettings) {
			setSettings(loadedSettings);
		}

		setIsLoading(false);
	}, [setSettings]);

	const toggleChatList = () => {
		setIsChatListOpen(!isChatListOpen);
	};

	if (isLoading) {
		return <Loading />;
	}

	return (
		<Router>
			<Titlebar />
			<div
				className='flex flex-col h-screen'
				data-theme={`${themeNames[theme]}`}>
				<div className='flex h-screen overflow-hidden bg-base-100'>
					<Sidebar toggleChatList={toggleChatList} />
					<AnimatePresence mode='wait'>
						{isChatListOpen && (
							<motion.div
								key='chatList'
								initial={{ opacity: 0, x: -50 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -50 }}
								transition={{ duration: 0.3 }}>
								<ChatList />
							</motion.div>
						)}
					</AnimatePresence>
					<PageTransitionWrapper>
						<Route path='/' element={<MainContent />} />
						<Route path='/settings' element={<Settings />} />
						<Route path='/img' element={<ImgMainContent />} />
					</PageTransitionWrapper>
				</div>
			</div>
		</Router>
	);
}

export default App;
