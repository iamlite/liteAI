import React from 'react';
import ClearButton from './clearbutton';

const ConsolePooper = () => {
	const logStoreValues = () => {
		const allStoreValues = window.electron.ipcRenderer.store.get(null);

		// Define keys to be sorted and style information
		const sortedKeys = [
			'settings',
			'stats',
			'lightMode',
			'darkMode',
			'conversations',
			'images',
		];
		const styleText = 'color: blue; font-weight: bold;';
		const emoji = '🔍';
		const emoji2 = '🔸';
		const emoji3 = '🔹';
		const emoji4 = '🔻';
		const emoji5 = '🔽';

		// Remove userAvatar and assistantAvatar from settings before logging
		if (allStoreValues && allStoreValues.settings) {
			delete allStoreValues.settings.userAvatar;
			delete allStoreValues.settings.assistantAvatar;
		}

		// Helper function to log nested properties
		const logNestedProperties = (
			obj: { [x: string]: never },
			indentation = '',
		) => {
			for (const key in obj) {
				if (typeof obj[key] === 'object' && obj[key] !== null) {
					console.groupCollapsed(
						`${indentation}${key}`,
						`${styleText} background-color: #f0f0f0; padding: 2px 6px; border-radius: 4px;`,
					);
					logNestedProperties(obj[key], `${indentation}\t`);
					console.groupEnd();
				} else {
					console.log(`${emoji2} ${key}:`, obj[key]);
				}
			}
		};
		sortedKeys.forEach((key) => {
			if (key === 'settings') {
				console.group(
					`%c${emoji5} ${key}`,
					`${styleText} background-color: #f9a825; color: #fff; padding: 4px 8px; border-radius: 8px;`,
				);
				logNestedProperties(allStoreValues[key], '\t');
				console.groupEnd();
			} else if (key === 'stats') {
				console.log(
					`%c${emoji3} ${key}`,
					`${styleText} background-color: #f57c00; color: #fff; padding: 4px 8px; border-radius: 8px;`,
				);
				logNestedProperties(allStoreValues[key], '\t');
				console.groupEnd();
			} else if (key === 'lightMode' || key === 'darkMode') {
				console.log(
					`%c${emoji4} ${key}:`,
					`${styleText} background-color: #4caf50; color: #fff; padding: 4px 8px; border-radius: 8px;`,
					allStoreValues[key],
				);
			} else {
				console.groupCollapsed(
					`%c${emoji} ${key}`,
					`${styleText} background-color: #3f51b5; color: #fff; padding: 4px 8px; border-radius: 8px;`,
				);
				console.log(allStoreValues[key]);
				console.groupEnd();
			}
		});

		for (const key in allStoreValues) {
			if (
				!sortedKeys.includes(key) &&
				key !== 'userAvatar' &&
				key !== 'assistantAvatar'
			) {
				console.groupCollapsed(
					`%c${emoji} ${key}`,
					`${styleText} background-color: #9e9e9e; color: #fff; padding: 4px 8px; border-radius: 8px;`,
				);
				console.log(allStoreValues[key]);
				console.groupEnd();
			}
		}
	};

	return (
		<div>
			<button
				type='button'
				className='btn btn-sm btn-warning'
				onClick={logStoreValues}>
				Poop
			</button>
			<ClearButton />
		</div>
	);
};

export default ConsolePooper;
