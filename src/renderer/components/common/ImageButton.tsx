import React from 'react';
import { HiPhoto } from 'react-icons/hi2';
import { useLocation } from 'react-router-dom';

interface SettingsButtonProps {
	onClick: () => void;
}

function ImageButton({ onClick }: SettingsButtonProps) {
	const location = useLocation();
	const isActive = location.pathname === '/img';
	return (
		<button
			type='button'
			className={`flex items-center ${
				isActive ? 'border-b-2 rounded-xl opacity-75' : ''
			}`}
			onClick={onClick}>
			<span className='flex items-center justify-center h-12 w-12 rounded-full hover:scale-150 transition duration-500 ease-in-out'>
				<HiPhoto className='w-6 h-6' />
			</span>
		</button>
	);
}

export default ImageButton;
