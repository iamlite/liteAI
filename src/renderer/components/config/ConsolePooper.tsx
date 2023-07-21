import React from 'react';

const ConsolePooper = () => {
	const logStoreValues = () => {
		// Retrieve all values from Electron store
		const allStoreValues = window.electron.ipcRenderer.store.get(null);
		const totalCount = Object.keys(allStoreValues).length;

		// Get the current timestamp
		const timestamp = new Date().toLocaleString();

		// Styling for console logs
		const headerStyle = 'background: #3a2787; color: #fff; padding: 4px;';
		const separatorStyle = 'color: #292929; font-weight: bold;';
		const keyStyle = 'color: #fcb0c7; font-weight: bold;';
		const valueStyle = 'color: #fff; font-family: monospace;';

		// Function to truncate URLs for cleaner display
		const truncateURL = (url: string) => {
			const maxLength = 40;
			return url.length > maxLength ? url.slice(0, maxLength) + '...' : url;
		};

		// Log a separator for clarity
		console.log('%c------------------------------------', separatorStyle);
		console.log('%cConsolePooper Log:', headerStyle);
		console.log('%c------------------------------------', separatorStyle);

		// Log the total count and timestamp
		console.log(`%cTimestamp: ${timestamp}`, keyStyle);
		console.log(`%cTotal Stored Values: ${totalCount}`, keyStyle);

		// Log each value with improved formatting
		Object.keys(allStoreValues).forEach((key) => {
			const value = allStoreValues[key];
			console.log('%c------------------------------------', separatorStyle);
			console.log(`%cKey: ${key}`, keyStyle);

			// Collapsible section for "conversations" key
			if (key === 'conversations') {
				console.groupCollapsed('%cValue:', keyStyle);
			} else {
				console.log('%cValue:', keyStyle);
			}

			// Truncate URLs in the value
			const truncatedValue = JSON.stringify(
				value,
				(key, val) => {
					if (typeof val === 'string') {
						if (val.startsWith('http') && val.length > 40) {
							return truncateURL(val);
						} else if (val.startsWith('data:image')) {
							return truncateURL(val);
						}
					}
					return val;
				},
				2,
			);

			// Render truncated value and add a dropdown for truncated URLs
			console.log(`%c${truncatedValue}`, valueStyle);
			if (truncatedValue.includes('...')) {
				console.groupCollapsed('%cClick to see full URL', valueStyle);
				console.log(value);
				console.groupEnd();
			}

			// Close the collapsible group if applicable
			if (key === 'conversations') {
				console.groupEnd();
			}
		});

		// Log a closing separator
		console.log('%c------------------------------------', separatorStyle);
	};

	return (
		<button
			type='button'
			className='btn btn-sm btn-warning'
			onClick={logStoreValues}>
			Poop
		</button>
	);
};

export default ConsolePooper;
