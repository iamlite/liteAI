import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AiOutlineHeart, AiFillApi, AiOutlineArrowRight } from 'react-icons/ai';
import { HiFire } from 'react-icons/hi';

const HomePage = () => {
	const navigate = useNavigate();

	const handleTextClick = () => {
		navigate('/text');
	};

	const handleimgClick = () => {
		navigate('/img');
	};

	return (
		<motion.div
			className='flex flex-col h-full w-full pb-7 pt-10 px-5'
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.5 }}>
			<div className='flex flex-col bg-base-300 rounded-3xl h-full w-full justify-center'>
				<div className='flex justify-center'>
					<motion.div className='stats shadow scrollbar-none'>
						<motion.div
							className='stat'
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.95 }}>
							<div className='stat-figure text-primary'>
								<AiOutlineHeart className='text-3xl' />
							</div>
							<div className='stat-title'>Total Tokens Used</div>
							<div className='stat-value text-primary'>25.6K</div>
							<div className='stat-desc'>something interesting goes here</div>
						</motion.div>
						<motion.div
							className='stat'
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.95 }}>
							<div className='stat-figure text-secondary'>
								<AiFillApi className='text-3xl' />
							</div>
							<div className='stat-title'>Images Generated</div>
							<div className='stat-value text-secondary'>
								{window.electron.ipcRenderer.store.get('stats.imagesGenerated')}
							</div>
							<div className='stat-desc'>
								Estimated Cost:{' '}
								{(
									window.electron.ipcRenderer.store.get(
										'stats.imagesGenerated',
									) * 0.018
								).toFixed(3)}
							</div>
						</motion.div>
						<motion.div
							className='stat'
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.95 }}>
							<div className='stat-figure text-secondary'>
								<div className='avatar'>
									<div className='w-16 rounded-full'>
										<img
											src={window.electron.ipcRenderer.store.get(
												'settings.userAvatar',
											)}
											alt='Avatar'
										/>
									</div>
								</div>
							</div>
							<div className='stat-title'>Current Light Theme:</div>
							<div className='stat-desc text-secondary'>
								{window.electron.ipcRenderer.store.get('lightMode')}
							</div>
							<div className='stat-title'>Current Dark Theme:</div>
							<div className='stat-desc text-secondary'>
								{window.electron.ipcRenderer.store.get('darkMode')}
							</div>
						</motion.div>
					</motion.div>
				</div>

				<motion.div
					className='px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}>
					<motion.div
						className='max-w-screen-sm sm:text-center sm:mx-auto'
						initial={{ y: 50, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: 50, opacity: 0 }}
						transition={{ duration: 0.5, delay: 0.4 }}>
						<motion.a
							aria-label='View'
							className='inline-block mb-5 rounded-full sm:mx-auto'
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.95 }}>
							<motion.div className='flex items-center justify-center w-16 h-16 mb-4 rounded-full'>
								<HiFire className='w-8 h-8 text-primary' />
							</motion.div>
						</motion.a>
						<motion.h2
							className='mb-4 font-sans text-3xl font-bold tracking-tight sm:text-4xl sm:leading-none'
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.95 }}>
							Welcome to LiteAI
						</motion.h2>
						<motion.p
							className='text-base md:text-lg sm:px-4'
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.95 }}>
							Your personal assistant, just the way you want it.
						</motion.p>
						<motion.hr
							className='w-full my-8'
							initial={{ scaleX: 0 }}
							animate={{ scaleX: 1 }}
							exit={{ scaleX: 0 }}
							transition={{ duration: 0.5, delay: 0.6 }}
						/>
					</motion.div>
				</motion.div>

				<motion.div
					className='flex flex-row px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20'
					initial={{ opacity: 0, translateY: -100 }}
					animate={{ opacity: 1, translateY: 'auto' }}
					exit={{ opacity: 0, translateY: 100 }}
					transition={{ duration: 0.5, delay: 0.8 }}>
					<motion.button
						type='button'
						className='card text-left w-96 bg-base-100 shadow-xl px-2 mx-2 rounded-2xl relative'
						onClick={handleTextClick}
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.95 }}>
						<motion.div className='card-body'>
							<motion.h2 className='card-title text-primary'>
								Start a Chat
							</motion.h2>
							<motion.p>
								Ask a question or give your personal assistant a task to get
								started. Or just say Hello!
							</motion.p>
						</motion.div>
						<motion.div className='absolute bottom-3 right-3 w-6 h-6 text-secondary'>
							<AiOutlineArrowRight />
						</motion.div>
					</motion.button>
					<motion.button
						type='button'
						className='card text-left w-96 bg-base-100 shadow-xl px-2 mx-2 rounded-2xl relative'
						onClick={handleimgClick}
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.95 }}>
						<motion.div className='card-body'>
							<motion.h2 className='card-title text-secondary'>
								Generate an Image
							</motion.h2>
							<motion.p>
								Generate stunning images with just a few clicks. Your creativity
								is the only limit.
							</motion.p>
						</motion.div>
						<motion.div className='absolute bottom-3 right-3 w-6 h-6 text-secondary'>
							<AiOutlineArrowRight />
						</motion.div>
					</motion.button>
				</motion.div>
			</div>
		</motion.div>
	);
};

export default HomePage;
