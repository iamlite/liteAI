import React, { useState, useEffect, useRef, CSSProperties } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { BiCopy, BiCheck } from 'react-icons/bi';
import StyledMarkdown from './StyledMarkdown';

type ChatBubbleProps = {
	message: string;
	role: string;
	tokenCount: number;
};

function ChatBubble({ message, role, tokenCount }: ChatBubbleProps) {
	const [copiedBubble, setCopiedBubble] = useState(false);
	const chatBubbleRef = useRef<HTMLDivElement>(null);
	const controls = useAnimation();

	useEffect(() => {
		let timeoutId: ReturnType<typeof setTimeout>;
		if (copiedBubble) {
			timeoutId = setTimeout(() => setCopiedBubble(false), 2000);
		}
		return () => clearTimeout(timeoutId);
	}, [copiedBubble]);

	const handleBubbleCopy = () => {
		if (!chatBubbleRef.current) return;
		navigator.clipboard.writeText(chatBubbleRef.current.innerText);
		setCopiedBubble(true);
	};

	const renderCodeBlock = (code: string, language: string) => {
		const customStyle: CSSProperties = {
			borderRadius: '0.75em',
			overflowX: 'auto',
			maxWidth: '100%',
		};

		return (
			<div className='relative'>
				<SyntaxHighlighter
					language={language}
					style={vscDarkPlus}
					customStyle={customStyle}>
					{code}
				</SyntaxHighlighter>
				<button
					type='button'
					className='btn btn-xs btn-circle btn-base-100 absolute top-1 right-1 text-xs opacity-10 hover:opacity-100 transition duration-500'
					onClick={handleBubbleCopy}>
					{copiedBubble ? <BiCheck /> : <BiCopy />}
				</button>
			</div>
		);
	};

	useEffect(() => {
		controls.start({ opacity: 1, y: 0 });
	}, [controls]);

	const avatarURL = localStorage.getItem(
		role === 'user' ? 'userAvatarURL' : 'assistantAvatarURL',
	);

	const isShortMessage = message.length < 10;

	return (
		<motion.div
			initial={{ opacity: 0, y: 40 }}
			animate={controls}
			exit={{ opacity: 0, y: 40 }}>
			<div className={`chat ${role === 'user' ? 'chat-end' : 'chat-start'}`}>
				{avatarURL && (
					<div className='chat-image avatar'>
						<div className='w-10 mask mask-hexagon'>
							<img src={avatarURL} alt={role} />
						</div>
					</div>
				)}
				<div className='chat-header' />
				<div
					ref={chatBubbleRef}
					className={`chat-bubble ${
						role === 'assistant'
							? 'chat-bubble-base-100'
							: 'chat-bubble-primary'
					} max-w-[50%] py-3 px-4 rounded-xl drop-shadow-lg transition ease-in-out duration-500`}
					style={{
						whiteSpace: 'pre-wrap',
						minHeight: '1em',
						position: 'relative',
					}}>
					{message.includes('```') ? (
						message.split('```').map((block, index) => {
							const isCodeBlock = index % 2 !== 0;
							if (isCodeBlock) {
								const language = block.split('\n')[0].trim();
								const code = block.slice(language.length + 1);
								return renderCodeBlock(code, language);
							} else {
								return <StyledMarkdown key={index}>{block}</StyledMarkdown>;
							}
						})
					) : (
						<StyledMarkdown>{message}</StyledMarkdown>
					)}
					<div
						className={`text-xs text-base-content opacity-50 absolute ${
							role === 'user' ? 'left-2' : 'right-2'
						} -bottom-5 truncate`}>
						{tokenCount === 0 ? ( 
							<div style={{ position: 'relative', top: '5px' }}>
								<span className='loading loading-ring loading-sm'></span>
							</div>
						) : (
							`Tokens: ${tokenCount}`
						)}
					</div>
				</div>
				<div className='chat-footer'>
					{isShortMessage ? null : (
						<button
							type='button'
							className='pl-2 text-xs truncate opacity-20 hover:opacity-100 transition duration-500'
							onClick={handleBubbleCopy}>
							{copiedBubble ? 'Copied!' : 'Copy'}
						</button>
					)}
				</div>
			</div>
		</motion.div>
	);
}

export default ChatBubble;
