import React, { useState, useContext, useRef } from 'react';
import { AiOutlineSend, AiFillProfile } from 'react-icons/ai';
import callDALL_E from './dalleApi';
import { ToastContext } from '../context/ToastContext';
import SnippetsMenu from './SnippetsMenu';
import ReactDOM from 'react-dom';

interface ImageGenerationInputProps {
	onImageGenerated: (b64_image: string) => void;
}

const ImageGenerationInput: React.FC<ImageGenerationInputProps> = ({
	onImageGenerated,
}) => {
	const [prompt, setPrompt] = useState('');
	const [n, setN] = useState(1);
	const [size, setSize] = useState('256x256');
	const [loading, setLoading] = useState(false);
	const { addToast } = useContext(ToastContext);
	const [menuVisible, setMenuVisible] = useState(false);
	const buttonRef = useRef<HTMLButtonElement>(null);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		if (prompt.trim() !== '') {
			setLoading(true);
			setPrompt('');
			addToast('Generating...', 'info');
			await callDALL_E({ prompt, n, size }, handleResponse);
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			handleSubmit(event);
		}
	};

	const handleResponse = (response: { b64_image: string }) => {
		addToast(`Image generated`, 'success');
		onImageGenerated(response.b64_image);
		setLoading(false);
	};

	const toggleMenu = () => {
		setMenuVisible(!menuVisible);
	};

	const handleSnippetSelect = (snippet: string) => {
		setPrompt((prevPrompt) => `${prevPrompt} ${snippet}`);
	};

	return (
		<div>
			{loading && (
				<div className='fixed inset-0 flex items-center justify-center z-50'>
					<div className='absolute inset-0 bg-black opacity-90'></div>
					<span className='loading loading-ring loading-lg'></span>
				</div>
			)}

			<footer className='text-center'>
				<div>
					<form onSubmit={handleSubmit}>
						<div className='flex items-center px-3 py-2 rounded-lg bg-neutral transition ease-in-out duration-500'>
							<button
								type='button'
								className='btn btn-circle btn-ghost mr-3'
								ref={buttonRef}
								onClick={toggleMenu}>
								<AiFillProfile className='w-6 h-6 text-secondary' />
							</button>

							{menuVisible &&
								ReactDOM.createPortal(
									<SnippetsMenu
										visible={menuVisible}
										buttonRef={buttonRef}
										onSelect={handleSnippetSelect}
									/>,
									document.body,
								)}

							<textarea
								id='textnput'
								rows={1}
								className='textarea w-full resize-none focus:outline-none bg-neutral text-neutral-content'
								placeholder='Your image description...'
								value={prompt}
								onChange={(event) => setPrompt(event.target.value)}
								onKeyDown={handleKeyDown}
							/>
							<select
								value={n}
								onChange={(event) => setN(Number(event.target.value))}
								className='btn btn-outline btn-sm btn-neutral-content mx-3'>
								{Array.from({ length: 10 }, (_, i) => (
									<option key={i} value={i + 1}>
										{i + 1}
									</option>
								))}
							</select>
							<select
								value={size}
								onChange={(event) => setSize(event.target.value)}
								className='btn btn-outline btn-sm btn-neutral-content mx-3'>
								{['256x256', '512x512', '1024x1024'].map((option) => (
									<option key={option} value={option}>
										{option}
									</option>
								))}
							</select>
							<button
								id='sendBtn'
								type='submit'
								className='btn btn-circle btn-ghost mx-3'>
								<AiOutlineSend className='w-6 h-6 text-secondary' />
							</button>
						</div>
					</form>
				</div>
			</footer>
		</div>
	);
};

export default ImageGenerationInput;
