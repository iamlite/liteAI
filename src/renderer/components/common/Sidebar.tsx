import { useNavigate, useLocation } from 'react-router-dom';
import { HiFire, HiHome, HiCog, HiChatBubbleLeftEllipsis, HiPhoto } from 'react-icons/hi2';
import { AiFillLeftCircle, AiFillRightCircle } from 'react-icons/ai';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';
import DarkModeToggle from './DarkModeToggle';

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

function Sidebar() {
	const navigate = useNavigate();
	const location = useLocation();
	const [isExpanded, setIsExpanded] = useState(false);

	const handleButtonClick = (path: string) => {
		navigate(path);
	};

	const sidebarVariants = {
		open: {
			width: '200px',
			transition: { type: 'spring', stiffness: 300, damping: 10 },
		},
		closed: {
			width: '80px',
			transition: { type: 'spring', stiffness: 300, damping: 10 },
		},
	};

	const isActive = (path: string) => location.pathname === path;
	const buttonStyle = isExpanded ? 'btn btn-ghost justify-start' : 'btn btn-circle btn-ghost';

	const textVariants = {
		open: { opacity: 1, x: 0, display: 'inline', transition: { duration: 0.3 } },
		closed: { opacity: 0, x: 30, display: 'none', transition: { duration: 0.3 } },
	};

	const toggleExpansion = () => {
		setIsExpanded(!isExpanded);
	};

	return (
		<div className='flex flex-row pl-5 pb-7 pt-10 flex-grow'>
			<motion.div
				className='flex flex-col px-4 py-10 items-center rounded-3xl bg-primary'
				initial={false}
				animate={isExpanded ? 'open' : 'closed'}
				variants={sidebarVariants}
				transition={{ type: 'spring'}}
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
				</div>
				<DarkModeToggle />
				<button 
					type='button' 
					className='btn btn-circle btn-xs btn-outline my-5' 
					onClick={toggleExpansion}
				>
					{isExpanded ? <AiFillLeftCircle className='w-5 h-5' /> : <AiFillRightCircle className='w-5 h-5' />}
				</button>
			</motion.div>
		</div>
	);
}

export default Sidebar;
