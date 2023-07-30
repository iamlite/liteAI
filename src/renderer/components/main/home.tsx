import React from 'react';
import { motion } from 'framer-motion';
import Stats from './Stats';
import WelcomeSection from './WelcomeSection';
import ActionButtons from './ActionButtons';

const HomePage = () => {
	return (
		<motion.div
			className='flex flex-col h-full w-full pb-7 pt-10 px-5'
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.1 }}
		>
			<div className='flex flex-col bg-base-300 rounded-3xl h-full w-full justify-center'>
				<div className='flex justify-center'>
					<Stats />
				</div>
				<WelcomeSection />
				<ActionButtons />
			</div>
		</motion.div>
	);
};

export default HomePage;
