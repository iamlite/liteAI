import { useNavigate, useLocation } from 'react-router-dom';
import { HiFire, HiHome, HiCog, HiChatBubbleLeftEllipsis, HiPhoto } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';
import DarkModeToggle from './DarkModeToggle';

interface SidebarProps {
	toggleChatList: () => void;
}

interface SidebarButton {
	path: string;
	icon: React.ReactNode;
	label: string;
}

const buttons: SidebarButton[] = [
	{ path: '/', icon: <HiHome className='w-6 h-6' />, label: 'Home' },
	{ path: '/text', icon: <HiChatBubbleLeftEllipsis className='w-6 h-6' />, label: 'Chat' },
	{ path: '/img', icon: <HiPhoto className='w-6 h-6' />, label: 'Image' },
	{ path: '/settings', icon: <HiCog className='w-6 h-6' />, label: 'Settings' },
];

function Sidebar({ toggleChatList }: SidebarProps) {
	const navigate = useNavigate();
	const location = useLocation();
	const [isExpanded, setIsExpanded] = useState(false);

	const handleButtonClick = (path: string) => {
		navigate(path);
	};

	const sidebarVariants = {
		open: { width: '200px', transition: { type: 'spring', stiffness: 200 } },
		closed: { width: '80px', transition: { type: 'spring', stiffness: 100 } },
	};

	const isActive = (path: string) => location.pathname === path;

	const buttonStyle = isExpanded ? 'btn btn-ghost justify-start' : 'btn btn-circle btn-ghost';

	const textVariants = {
		open: { opacity: 1, x: 0, display: 'inline', transition: { duration: 0.3 } },
		closed: { opacity: 0, x: 30, display: 'none', transition: { duration: 0.3 } }, // Added x and transition properties
	};

	return (
		<div className='flex flex-row pl-5 pb-7 pt-10 flex-grow'>
			<motion.div
				className='flex flex-col px-4 py-10 items-center rounded-3xl bg-primary'
				initial={false}
				animate={isExpanded ? 'open' : 'closed'}
				variants={sidebarVariants}
				transition={{ type: 'spring', stiffness: 100, restDelta: 2 }}
				onMouseEnter={() => setIsExpanded(true)}
				onMouseLeave={() => setTimeout(() => setIsExpanded(false), 300)}
			>
				<div className='flex items-center justify-center h-12 w-12 rounded-full bg-secondary'>
					<HiFire className='w-10 h-10' />
				</div>

				<div className='flex flex-col space-y-2 mt-12 w-full'>
					{buttons.map((button) => (
						<button
							key={button.path}
							type='button'
							className={`${buttonStyle} ${isActive(button.path) ? 'drop-shadow-md shadow-lg' : ''}`}
							onClick={() => handleButtonClick(button.path)}
						>
							<span className='flex items-center justify-start'>
								<span className='flex items-center'>
									{button.icon}
									<AnimatePresence>
										{isExpanded && (
											<motion.span
												className='ml-2'
												variants={textVariants}
												initial='closed'
												animate='open'
												exit='closed'
											>
												{button.label}
											</motion.span>
										)}
									</AnimatePresence>
								</span>
							</span>
						</button>
					))}
					{location.pathname === '/text' && (
						<motion.button
							type='button'
							className={`${buttonStyle} ${isActive('/text') ? 'drop-shadow-md shadow-lg' : ''}`}
							onClick={toggleChatList}
							variants={textVariants}
							initial='closed'
							animate={isExpanded ? 'open' : 'closed'}
							exit='closed'
						>
							<span className='flex items-center justify-start'>
								<span className='flex items-center'>
									<HiChatBubbleLeftEllipsis className='w-6 h-6' />
									{isExpanded && <span className='ml-2'>Chat</span>}
								</span>
							</span>
						</motion.button>
					)}
				</div>
				<DarkModeToggle />
			</motion.div>
		</div>
	);
}

export default Sidebar;
