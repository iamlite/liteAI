import React, { useRef } from 'react';
import {
	HiOutlineTrash,
	HiArrowDownOnSquare,
} from 'react-icons/hi2';

interface ImageDisplayProps {
	url: string;
	onDelete: () => void;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ url, onDelete }) => {
	const handleSaveImage = () => {
		const base64Image = url.split(';base64,').pop();
		const byteCharacters = atob(base64Image);
		const byteNumbers = new Array(byteCharacters.length);
		for (let i = 0; i < byteCharacters.length; i++) {
			byteNumbers[i] = byteCharacters.charCodeAt(i);
		}
		const byteArray = new Uint8Array(byteNumbers);
		const blob = new Blob([byteArray], { type: 'image/png' });
		const blobUrl = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = blobUrl;
		link.download = 'image.png';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const modalRef = useRef<HTMLDialogElement>(null);

	return (
		<div>
			<div className='relative flex flex-col justify-center items-center p-5 rounded-3xl bg-base-200'>
				<img
					className='rounded-t-3xl max-h-[250px] max-w-[250px] cursor-pointer'
					src={`data:image/png;base64,${url}`}
					alt='Generated'
					onClick={() => modalRef.current?.showModal()}
				/>

				<div className='flex flex-row join w-[250px] justify-center rounded-t-none'>
					<button className='btn btn-outline join-item flex-grow' onClick={handleSaveImage}>
						<HiArrowDownOnSquare className='w-5 h-5' />
						Save IMG
					</button>
					<button
						onClick={onDelete}
						className='btn btn-outline btn-warning join-item flex-grow'>
						<HiOutlineTrash className='w-5 h-5' />
						Delete
					</button>
				</div>
			</div>


			<dialog id='my_modal_3' className='modal' ref={modalRef}>
				<form method='dialog' className='modal-box'>
					<button
						className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'
						onClick={() => modalRef.current?.close()}>
						✕
					</button>
					<div className='flex justify-center items-center'>
						<img
							className='max-w-full h-auto'
							src={`data:image/png;base64,${url}`}
							alt='Generated'
						/>
					</div>
				</form>
				<form method='dialog' className='modal-backdrop'>
					<button></button> {/* important */}
				</form>
			</dialog>
		</div>
	);
};

export default ImageDisplay;
