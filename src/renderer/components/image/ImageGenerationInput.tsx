import React, { useState, useContext } from 'react';
import { AiOutlineSend, AiFillProfile } from 'react-icons/ai';
import { callDALL_E } from './dalleApi';
import { ToastContext } from '../context/ToastContext';

interface ImageGenerationInputProps {
	onImageGenerated: (b64_image: string) => void;
}

function ImageGenerationInput({ onImageGenerated }: ImageGenerationInputProps) {
	const [prompt, setPrompt] = useState('');
	const [n, setN] = useState(1);
	const [size, setSize] = useState('256x256');
	const [loading, setLoading] = useState(false);
	const { addToast } = useContext(ToastContext);

    const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		if (prompt.trim() !== '') {
			setLoading(true);
			setPrompt('');
			addToast('Generating...', 'info');
			await callDALL_E(
				{
					prompt,
					n,
					size,
				},
				(response) => {
					addToast(`Image generated`, 'success');
					onImageGenerated(response.b64_image);
					setLoading(false);
				},
			);
		}
	};


	const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			handleSubmit(event);
		}
	};

	return (
		<div>
			{loading && (
				<div className='fixed inset-0 flex items-center justify-center z-50'>
					<div className='absolute inset-0 bg-black opacity-90'></div>
					<span className='loading loading-ring loading-lg'></span>
				</div>
			)}

			<FooterForm
				handleSubmit={handleSubmit}
				handleKeyDown={handleKeyDown}
				setPrompt={setPrompt}
				setN={setN}
				setSize={setSize}
				prompt={prompt}
				n={n}
				size={size}
			/>
		</div>
	);
}

interface FooterFormProps {
	handleSubmit: (event: React.FormEvent) => void;
	handleKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
	setPrompt: React.Dispatch<React.SetStateAction<string>>;
	setN: React.Dispatch<React.SetStateAction<number>>;
	setSize: React.Dispatch<React.SetStateAction<string>>;
	prompt: string;
	n: number;
	size: string;
}

const FooterForm: React.FC<FooterFormProps> = ({
	handleSubmit,
	handleKeyDown,
	setPrompt,
	setN,
	setSize,
	prompt,
	n,
	size,
}) => (
	<footer className='text-center'>
		<div>
			<form onSubmit={handleSubmit}>
				<div className='flex items-center px-3 py-2 rounded-lg bg-neutral transition ease-in-out duration-500'>
					<ProfileButton />
					<PromptInput
						handleKeyDown={handleKeyDown}
						setPrompt={setPrompt}
						prompt={prompt}
					/>
					<ImageCountSelect setN={setN} n={n} />
					<ImageSizeSelect setSize={setSize} size={size} />
					<SendButton />
				</div>
			</form>
		</div>
	</footer>
);

const ProfileButton: React.FC = () => (
	<div className='tooltip tooltip-bottom tooltip-accent' data-tip='Coming Soon'>
		<button
			id='speeddial'
			type='button'
			className='btn btn-circle btn-ghost mr-3'>
			<AiFillProfile className='w-6 h-6 text-secondary' />
		</button>
	</div>
);

interface PromptInputProps {
	handleKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
	setPrompt: React.Dispatch<React.SetStateAction<string>>;
	prompt: string;
}

const PromptInput: React.FC<PromptInputProps> = ({
	handleKeyDown,
	setPrompt,
	prompt,
}) => (
	<textarea
		id='textnput'
		rows={1}
		className='textarea w-full resize-none focus:outline-none bg-neutral text-neutral-content'
		placeholder='Your image description...'
		value={prompt}
		onChange={(event) => setPrompt(event.target.value)}
		onKeyDown={handleKeyDown}
	/>
);

interface ImageCountSelectProps {
	setN: React.Dispatch<React.SetStateAction<number>>;
	n: number;
}

const ImageCountSelect: React.FC<ImageCountSelectProps> = ({ setN, n }) => (
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
);

interface ImageSizeSelectProps {
	setSize: React.Dispatch<React.SetStateAction<string>>;
	size: string;
}

const ImageSizeSelect: React.FC<ImageSizeSelectProps> = ({ setSize, size }) => (
	<select
		value={size}
		onChange={(event) => setSize(event.target.value)}
		className='btn btn-outline btn-sm btn-neutral-content mx-3'>
		<option value='256x256'>256x256</option>
		<option value='512x512'>512x512</option>
		<option value='1024x1024'>1024x1024</option>
	</select>
);

const SendButton: React.FC = () => (
	<button id='sendBtn' type='submit' className='btn btn-circle btn-ghost mx-3'>
		<AiOutlineSend className='w-6 h-6 text-secondary' />
	</button>
);

export default ImageGenerationInput;
