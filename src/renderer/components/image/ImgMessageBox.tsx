import React, { useContext, useEffect, useState } from 'react';
import { HiOutlineTrash, HiInboxArrowDown } from 'react-icons/hi2';
import ImageDisplay from './ImageDisplay';
import Loading from '@context/Loading';
import { ToastContext } from '@context/ToastContext';

interface ImageData {
	url: string;
	prompt: string;
	size: string;
}

interface ImgMessageBoxProps {
	imageUrls: ImageData[];
	loading: boolean;
}

function ImgMessageBox({ imageUrls, loading }: ImgMessageBoxProps) {
	const [, setRefreshKey] = useState(0);
	const [showModal, setShowModal] = useState(false);
	const { addToast } = useContext(ToastContext);

	useEffect(() => {
		imageUrls.forEach((imageData) => {
			const storedImages = window.electron.ipcRenderer.store.get('images') as Record<string, ImageData> || {};
			if (!Object.values(storedImages).map(image => image.url).includes(imageData.url)) {
				const id = Math.random().toString(36).substring(2);
				const newImageData = { ...storedImages, [id]: imageData };
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
		const storedImages = window.electron.ipcRenderer.store.get('images') as Record<string, ImageData> || {};
		const updatedImages = { ...storedImages };
		delete updatedImages[id];
		window.electron.ipcRenderer.store.set('images', updatedImages);
		setRefreshKey((prevKey) => prevKey + 1);
		addToast('Image Deleted', 'warning');
	};

	const storedImages = window.electron.ipcRenderer.store.get('images') as Record<string, ImageData> || {};

	const confirmDeleteAllImages = () => {
		deleteAllImages();
		setShowModal(false);
		addToast('All Images Deleted', 'warning');
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
					<div className="w-full h-full rounded-3xl overflow-hidden">
						<div className='w-full h-full bg-base-300 p-10 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-rounded-xl scrollbar-thumb-secondary'>
							<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4'>
								{Object.entries(storedImages).map(([id, imageData]) => (
									<ImageDisplay
										key={id}
										url={imageData.url}
										prompt={imageData.prompt}
										onDelete={() => deleteImage(id)}
										size={imageData.size}
									/>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>

		</div>
	);
}

export default ImgMessageBox;
