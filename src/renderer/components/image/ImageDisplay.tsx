import React from 'react';
import {
	HiOutlineTrash,
	HiArrowDownOnSquare,
	HiClipboard,
} from 'react-icons/hi2';

interface ImageDisplayProps {
	url: string;
	onDelete: () => void;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ url, onDelete }) => {
	const handleCopyUrl = () => {
		navigator.clipboard.writeText(url);
	};

	const handleSaveImage = () => {
		const base64Image = url.split(";base64,").pop();
		const byteCharacters = atob(base64Image);
		const byteNumbers = new Array(byteCharacters.length);
		for (let i = 0; i < byteCharacters.length; i++) {
			byteNumbers[i] = byteCharacters.charCodeAt(i);
		}
		const byteArray = new Uint8Array(byteNumbers);
		const blob = new Blob([byteArray], {type: "image/png"});
		const blobUrl = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = blobUrl;
		link.download = 'image.png';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};
	

	return (
		<div className='relative flex flex-col sm:flex-row p-5 rounded-3xl bg-base-200 transition-all ease-in-out duration-500'>
			<img
				className='max-h-[250px] max-w-full w-full rounded-lg object-contain'
				src={`data:image/png;base64,${url}`}
				alt='Generated'
			/>
	
			<div className='flex flex-col justify-center w-full overflow-hidden mt-5 sm:mt-0 sm:ml-5'>
				<button className='btn btn-outline my-1' onClick={handleCopyUrl}>
					<HiClipboard className='w-5 h-5' />
					Copy URL
				</button>
				<button className='btn btn-outline my-1' onClick={handleSaveImage}>
					<HiArrowDownOnSquare className='w-5 h-5' />
					Save IMG
				</button>
				<button
					onClick={onDelete}
					className='btn btn-outline btn-warning my-1'>
					<HiOutlineTrash className='w-5 h-5' />
					Delete
				</button>
			</div>
		</div>
	);
};

export default ImageDisplay;
