import React from 'react';

export default function Loading() {
	return (
		<div className='flex items-center justify-center w-full h-full'>
			<div className='fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-primary z-50'>
				<div className='flex flex-col justify-center items-center space-x-1 text-sm'>
					<span className='loading loading-ring loading-lg' />
					<h1 className='text-3xl font-md'>Loading</h1>
				</div>
			</div>
		</div>
	);
}
