import React, { useContext, useRef } from 'react';
import { HiOutlineTrash, HiArrowDownOnSquare, HiClipboard } from 'react-icons/hi2';
import { ToastContext } from '@context/ToastContext';

interface ImageDisplayProps {
	url: string;
	prompt: string;
	onDelete: () => void;
	size: string;
}

const ButtonGroup: React.FC<{onDelete: () => void; handleSaveImage: () => void; handleCopyToClipboard: () => void;}> = ({ onDelete, handleSaveImage, handleCopyToClipboard }) => (
	<div className='flex flex-row join justify-center rounded-t-none w-full '>
		<button className='btn btn-square btn-outline border-r-0 join-item flex-grow' onClick={handleSaveImage}>
			<HiArrowDownOnSquare className='w-5 h-5 text-primary' />
		</button>
		<button className='btn btn-square btn-outline border-x-0 join-item flex-grow' onClick={handleCopyToClipboard}>
			<HiClipboard className='w-5 h-5 text-secondary' />
		</button>
		<button onClick={onDelete} className='btn btn-square btn-outline border-l-0 join-item flex-grow'>
			<HiOutlineTrash className='w-5 h-5 text-warning' />
		</button>
	</div>
);

const ImageDisplayText: React.FC<{prompt: string; size: string;}> = ({ prompt, size }) => (
	<>
		<div className="mt-3 w-full bg-base-100 rounded-2xl overflow-hidden p-1">
			<p className="text-center text-xs opacity-50 capitalize whitespace-normal select-all">{size}</p>
		</div>
		<div className="mt-3 w-full h-16 bg-base-100 rounded-2xl overflow-hidden">
			<div className="h-full overflow-auto p-2 scrollbar-thin scrollbar-thumb-rounded-xl scrollbar-thumb-secondary scroll-smooth">
				<p className="text-center text-xs capitalize whitespace-normal select-all">{prompt}</p>
			</div>
		</div>
	</>
);

const ImageDisplay: React.FC<ImageDisplayProps> = ({ url, onDelete, prompt, size }) => {
	const { addToast } = useContext(ToastContext);
	const modalRef = useRef<HTMLDialogElement>(null);

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
		const generateId = (length = 6) => {
			return Math.random().toString(36).slice(2, length + 2);
		};

		const filename = `${prompt.slice(0, 15).replace(/\s/g, "")}-${size}-${generateId()}.png`;
		link.download = filename;

		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		addToast('Image Saved!', 'success');
	};
	const handleCopyToClipboard = () => {
		navigator.clipboard.writeText(prompt);
		addToast('Prompt Copied', 'success');
	};

	return (
		<div>
			<div className='relative flex flex-col justify-center items-center p-5 rounded-3xl bg-base-200'>
				<img
					className='rounded-t-3xl cursor-pointer max-w-[250px] max-h-[250px] w-full h-full outline outline-base-100'
					src={`data:image/png;base64,${url}`}
					alt='Generated'
					onClick={() => modalRef.current?.showModal()}
				/>
				<div className='flex justify-center w-full'>
					<ButtonGroup onDelete={onDelete} handleSaveImage={handleSaveImage} handleCopyToClipboard={handleCopyToClipboard} />
				</div>
				<ImageDisplayText prompt={prompt} size={size} />
			</div>
			<dialog id='my_modal_3' className='modal' ref={modalRef}>
				<form method='dialog' className='modal-box'>
					<div className='flex justify-center items-center'>
						<img
							className='w-full h-auto'
							src={`data:image/png;base64,${url}`}
							alt='Generated'
						/>
					</div>
					<div className='flex justify-center w-full'>
						<ButtonGroup onDelete={onDelete} handleSaveImage={handleSaveImage} handleCopyToClipboard={handleCopyToClipboard} />
					</div>
					<ImageDisplayText prompt={prompt} size={size} />
				</form>
				<form method='dialog' className='modal-backdrop backdrop-blur-md transition ease-in-out'>
					<button></button> {/* important */}
				</form>
			</dialog>
		</div>
	);
};

export default ImageDisplay;