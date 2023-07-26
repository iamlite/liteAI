import React, { useEffect, useState } from 'react';
import {
	MemoryRouter as Router,
	Routes,
	Route,
	useLocation,
} from 'react-router-dom';
import Titlebar from '@misc/window/Titlebar';
import { AnimatePresence } from 'framer-motion';
import { useSettings } from './context/SettingsContext';
import { useTheme, themeNames } from './context/ThemeContext';
import Sidebar from './common/Sidebar';
import MainContent from './text/TextMainContent';
import ImgMainContent from './image/ImgMainContent';
import Settings from './config/Settings';
import Loading from './Load';
import './Application.css';
import HomePage from './main/home';

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

	useEffect(() => {
		const loadedSettings = window.electron.ipcRenderer.store.get('settings');
		if (loadedSettings) {
			setSettings(loadedSettings);
		}

		setIsLoading(false);
	}, [setSettings]);


	if (isLoading) {
		return <Loading />;
	}

	return (
		<Router>

			<div
				className='flex flex-col h-screen'
				data-theme={`${themeNames[theme]}`}>
				<Titlebar />
				<div className='flex h-screen overflow-hidden bg-base-100'>
					<Sidebar />
					<PageTransitionWrapper>
						<Route path='/' element={<HomePage />} />
						<Route path='/text' element={<MainContent />} />
						<Route path='/settings' element={<Settings />} />
						<Route path='/img' element={<ImgMainContent />} />
					</PageTransitionWrapper>
				</div>
			</div>
		</Router>
	);
}

export default App;
