import React, { RefObject } from 'react';
import { motion } from 'framer-motion';
import { snippetsByCategory } from './SnippetsData';

interface SnippetsMenuProps {
	visible: boolean;
	buttonRef: RefObject<HTMLButtonElement>;
	onSelect: (snippet: string) => void;
}

const colorClasses = ['badge-primary', 'badge-secondary', 'badge-accent', 'badge-success', 'badge-info', 'badge-warning', 'badge-error', 'badge-outline'];

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			delayChildren: 0.5,
			staggerChildren: 0.2,
		},
	},
};

const snippetVariants = {
	rest: { scale: 1 },
	hover: { scale: 1.1 },
	click: { scale: 1.2 },
};

const categoryVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			duration: 0.5,
		},
	},
};

const SnippetsMenu: React.FC<SnippetsMenuProps> = ({
	visible,
	buttonRef,
	onSelect,
}) => {
	if (!visible) return null;

	const { top, left } = buttonRef.current?.getBoundingClientRect() || {};

	const styles = {
		bottom: `${window.innerHeight - top + window.scrollY}px`,
		left: `${left + window.scrollX}px`,
	};

	let colorIndex = 0;

	const renderCategory = ([category, snippets]: [string, string[]]) => {
		const currentColorClass = colorClasses[colorIndex];
		colorIndex = (colorIndex + 1) % colorClasses.length;

		return (
			<motion.div 
				key={category} 
				className=''
				variants={categoryVariants}
			>
				<h4>{category}</h4>
				{snippets.map((snippet) => (
					<motion.div
						key={snippet}
						className={`cursor-pointer badge badge-lg text-xs ${currentColorClass} m-2`}
						onClick={() => onSelect(snippet)}
						variants={snippetVariants}
						whileHover='hover'
						whileTap='click'
						initial='rest'
						animate='rest'
					>
						{snippet}
					</motion.div>
				))}
			</motion.div>
		);
	};

	return (
		<motion.div 
			className='fixed w-1/3 h-1/2 bg-base-200 border border-base-300 rounded-2xl p-4 my-2 overflow-hidden' 
			style={styles} 
			variants={containerVariants}
			initial='hidden'
			animate='visible'
		>
			<div className="h-full w-full overflow-hidden bg-base-100 p-3 rounded-2xl">
				<div className="h-grow w-full">
					<h1 className='text-xl font-bold'>Prompt Helpers</h1>
					<p className='text-sm opacity-75'>Click on a snippet to add it to your prompt.</p>
					<hr className='my-2 opacity-20' />
				</div>
				<motion.div className='flex flex-col h-full w-full py-5 overflow-y-auto scrollbar-thin' variants={containerVariants}>
					{Object.entries(snippetsByCategory).map(renderCategory)}
				</motion.div>
			</div>
		</motion.div>
	);
};

export default SnippetsMenu;
