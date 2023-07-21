import React, { useState, useRef, useContext } from 'react';
import { AiOutlineSend, AiFillProfile } from 'react-icons/ai';
import { callDALL_E } from './dalleApi';
import { ToastContext } from '../context/ToastContext';

interface ImageGenerationInputProps {
	onImageGenerated: (url: string) => void;
}

function ImageGenerationInput({ onImageGenerated }: ImageGenerationInputProps) {
	const [prompt, setPrompt] = useState('');
	const [n, setN] = useState(1);
	const [size, setSize] = useState('256x256');
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const { addToast } = useContext(ToastContext);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		if (prompt.trim() !== '') {
			addToast('Generating...', 'info');
			await callDALL_E(
				{
					prompt,
					n,
					size,
				},
				(response) => {
					addToast(`Image generated: ${response.url}`, 'success');
					onImageGenerated(response.url);
				},
			);
			setPrompt('');
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			handleSubmit(event);
		}
	};

	return (
		<footer className='text-center'>
			<div>
				<form onSubmit={handleSubmit}>
					<div className='flex items-center px-3 py-2 rounded-lg bg-neutral transition ease-in-out duration-500'>
						<div
							className='tooltip tooltip-bottom tooltip-accent'
							data-tip='Coming Soon'>
							<button
								id='speeddial'
								type='button'
								className='btn btn-circle btn-ghost mr-3'>
								<AiFillProfile className='w-6 h-6 text-secondary' />
							</button>
						</div>
						<textarea
							ref={textareaRef}
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
							<option value={1}>1</option>
							<option value={2}>2</option>
							<option value={3}>3</option>
							<option value={4}>4</option>
							<option value={5}>5</option>
							<option value={6}>6</option>
							<option value={7}>7</option>
							<option value={8}>8</option>
							<option value={9}>9</option>
							<option value={10}>10</option>
						</select>
						<select
							value={size}
							onChange={(event) => setSize(event.target.value)}
							className='btn btn-outline btn-sm btn-neutral-content mx-3'>
							<option value='256x256'>256x256</option>
							<option value='512x512'>512x512</option>
							<option value='1024x1024'>1024x1024</option>
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
	);
}

export default ImageGenerationInput;
