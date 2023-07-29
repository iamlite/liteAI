import React, { useEffect, useState } from 'react';
import { HiOutlineTrash, HiInboxArrowDown } from 'react-icons/hi2';
import ImageDisplay from './ImageDisplay';
import Loading from '@context/Loading';

interface ImgMessageBoxProps {
	imageUrls: string[];
	loading: boolean;
}

function ImgMessageBox({ imageUrls, loading }: ImgMessageBoxProps) {
	const [, setRefreshKey] = useState(0);
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		imageUrls.forEach((url) => {
			const storedImages =
				window.electron.ipcRenderer.store.get('images') || {};
			if (!Object.values(storedImages).includes(url)) {
				const id = Math.random().toString(36).substring(2);
				const newImageData = { ...storedImages, [id]: url };
				window.electron.ipcRenderer.store.set('images', newImageData);
				setRefreshKey((prevKey) => prevKey + 1);
			}
		});
	}, [imageUrls]);

	const deleteAllImages = () => {
		window.electron.ipcRenderer.store.set('images', {});
		setRefreshKey((prevKey) => prevKey + 1);
	};

	const deleteImage = (id: string) => {
		const storedImages = window.electron.ipcRenderer.store.get('images') || {};
		const updatedImages = { ...storedImages };
		delete updatedImages[id];
		window.electron.ipcRenderer.store.set('images', updatedImages);
		setRefreshKey((prevKey) => prevKey + 1);
	};

	const storedImages = window.electron.ipcRenderer.store.get('images') || {};

	const confirmDeleteAllImages = () => {
		deleteAllImages();
		setShowModal(false);
	};

	const renderModal = () => {
		return (
			<dialog
				id='confirmDialog'
				className='modal'
				open={showModal}
				onClick={() => setShowModal(false)}
			>
				<form method='dialog' className='modal-box'>
					<h3 className='font-bold text-lg'>Confirm Delete</h3>
					<p className='py-4'>Are you sure you want to delete all images?</p>
					<div className='modal-action'>
						<button className='btn' onClick={confirmDeleteAllImages}>
							Confirm
						</button>
						<button className='btn' onClick={() => setShowModal(false)}>
							Cancel
						</button>
					</div>
				</form>
			</dialog>
		);
	};

	return (
		<div className='flex flex-col h-full mb-5 overflow-hidden'>
			<div className='flex flex-row items-center p-5 rounded-3xl bg-neutral transition ease-in-out duration-500'>
				<div className='avatar placeholder'>
					<div className='bg-neutral-focus text-neutral-content rounded-full w-12'>
						<span>MX</span>
					</div>
				</div>
				<div className='flex flex-col ml-3 text-neutral-content'>
					<div className='font-semibold text-sm'>DALL-E 2 Image Generator</div>
				</div>
				<div className='ml-auto'>
					<ul className='menu menu-horizontal bg-transparent text-secondary rounded-box'>
						<li>
							<button
								type='button'
								onClick={() => setShowModal(true)}
							>
								<HiOutlineTrash className='w-5 h-5' />
							</button>
						</li>
						<li>
							<button type='button'>
								<HiInboxArrowDown className='w-5 h-5' />
							</button>
						</li>
					</ul>
				</div>
				{renderModal()}
			</div>

			<div className='flex flex-col h-full p-5 overflow-y-hidden'>
				<div className='relative w-full h-full'>
					<div className=''>
						{loading && (
							<Loading loading={loading} />
						)}
					</div>
					<div className='w-full h-full bg-base-300 p-10 rounded-3xl overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-rounded-xl scrollbar-thumb-secondary'>
						<div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
							{Object.entries(storedImages).map(([id, url]) => (
								<ImageDisplay
									key={id}
									url={url as string}
									onDelete={() => deleteImage(id)}
								/>
							))}
						</div>
					</div>
				</div>
			</div>

		</div>
	);
}

export default ImgMessageBox;
