import React, { useState, useContext, useRef } from 'react';
import { AiOutlineSend, AiFillProfile } from 'react-icons/ai';
import callDALL_E from './dalleApi';
import { ToastContext } from '@context/ToastContext';
import SnippetsMenu from './SnippetsMenu';
import ReactDOM from 'react-dom';

interface ImageGenerationInputProps {
	onImageGenerated: (b64_image: string, prompt: string, size: string) => void;
	setLoading: (loading: boolean) => void;
}

const ImageGenerationInput: React.FC<ImageGenerationInputProps> = ({
	onImageGenerated,
	setLoading,
}) => {
	const [prompt, setPrompt] = useState('');
	const [n, setN] = useState(1);
	const [size, setSize] = useState('256x256');
	const { addToast } = useContext(ToastContext);
	const [menuVisible, setMenuVisible] = useState(false);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const [isOpen1, setIsOpen1] = useState(false);
	const [isOpen2, setIsOpen2] = useState(false);
	const [history, setHistory] = useState<string[]>([]);
	const [pointer, setPointer] = useState(-1);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		if (prompt.trim() !== '') {
			setLoading(true);
			addToast('Generating...', 'info');
			setHistory([prompt, ...history]);
			setPointer(-1);
			await callDALL_E({ prompt, n, size }, (response) => handleResponse(response, prompt, size));
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			handleSubmit(event);
		}

		if (event.key === 'ArrowUp') {
			if (history.length > 0 && pointer < history.length - 1) {
				setPointer(pointer + 1);
				setPrompt(history[pointer + 1]);
			}
		}

		if (event.key === 'ArrowDown') {
			if (pointer > 0) {
				setPointer(pointer - 1);
				setPrompt(history[pointer - 1]);
			} else if (pointer === 0) {
				setPrompt('');
				setPointer(-1);
			}
		}
	};

	const handleResponse = (response: { b64_image: string }, prompt: string, size: string) => {
		addToast(`Image generated`, 'success');
		onImageGenerated(response.b64_image, prompt, size);
		setLoading(false);
	};

	const toggleMenu = () => {
		setMenuVisible(!menuVisible);
	};

	const handleSnippetSelect = (snippet: string) => {
		setPrompt((prevPrompt) => `${prevPrompt}, ${snippet}`);
	};

	return (
		<div>
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

							<div className="dropdown dropdown-top">
								<label tabIndex={0} className="btn m-1 btn-sm outline-none mx-3" onClick={() => setIsOpen1(!isOpen1)}>
									{n}
								</label>
								{isOpen1 && (
									<ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
										{Array.from({ length: 10 }, (_, i) => (
											<li key={i}>
												<a onClick={() => { setN(i + 1); setIsOpen1(false); }}>{i + 1}</a>
											</li>
										))}
									</ul>
								)}
							</div>
							<div className="dropdown dropdown-top">
								<label tabIndex={0} className="btn m-1 btn-sm outline-none mx-3" onClick={() => setIsOpen2(!isOpen2)}>
									{size}
								</label>
								{isOpen2 && (
									<ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
										{['256x256', '512x512', '1024x1024'].map((option) => (
											<li key={option}>
												<a onClick={() => { setSize(option); setIsOpen2(false); }}>{option}</a>
											</li>
										))}
									</ul>
								)}
							</div>

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
