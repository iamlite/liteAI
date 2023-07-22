import React from 'react';
import { AiOutlineHeart, AiFillApi, AiTwotoneThunderbolt } from 'react-icons/ai';

const HomePage = () => {
	return (
		<div className='flex flex-col h-full w-full pb-7 pt-10 px-5 '>
			<div className='flex flex-col bg-base-300 rounded-3xl h-full w-full justify-center'>
			<div className='flex justify-center '>
				<div className='stats shadow'>
					<div className='stat'>
						<div className='stat-figure text-primary'>
							<AiOutlineHeart className='text-3xl' />
						</div>
						<div className='stat-title'>Total Tokens Used</div>
						<div className='stat-value text-primary'>25.6K</div>
						<div className='stat-desc'>21% more than last month</div>
					</div>

					<div className='stat'>
						<div className='stat-figure text-secondary'>
							<AiFillApi className='text-3xl' />
						</div>
						<div className='stat-title'>Page Views</div>
						<div className='stat-value text-secondary'>2.6M</div>
						<div className='stat-desc'>21% more than last month</div>
					</div>

					<div className='stat'>
						<div className='stat-figure text-secondary'>
							<div className='avatar'>
								<div className='w-16 rounded-full'>
									<img
										src={window.electron.ipcRenderer.store.get(
											'settings.userAvatar',
										)}
									/>
								</div>
							</div>
						</div>
						<div className='stat-value'>86%</div>
						<div className='stat-title'>Tasks done</div>
						<div className='stat-desc text-secondary'>31 tasks remaining</div>
					</div>
				</div>
				</div>
				<div className='px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20'>
					<div className='max-w-screen-sm sm:text-center sm:mx-auto'>
						<a
							href='/'
							aria-label='View'
							className='inline-block mb-5 rounded-full sm:mx-auto'>
							<div className='flex items-center justify-center w-16 h-16 mb-4 rounded-full'>
								<AiTwotoneThunderbolt className='w-8 h-8 text-primary' />
							</div>
						</a>
						<h2 className='mb-4 font-sans text-3xl font-bold tracking-tight sm:text-4xl sm:leading-none'>
							Welcome to LiteAI
						</h2>
						<p className='text-base md:text-lg sm:px-4'>
							Sed ut perspiciatis unde omnis iste natus error sit voluptatem
							accusantium doloremque rem aperiam, eaque ipsa quae.
						</p>
						<hr className='w-full my-8' />
					</div>
				</div>
				</div>
			</div>
		
	);
};

export default HomePage;
