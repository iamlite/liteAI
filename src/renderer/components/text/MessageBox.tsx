import React, { useRef, useEffect, useMemo, useState } from 'react';
import { motion, animate, useMotionValue, useTransform } from 'framer-motion';
import { HiOutlineTrash, HiInboxArrowDown } from 'react-icons/hi2';
import { AiOutlineMenu } from 'react-icons/ai';
import { useConversations } from '../context/ConversationContext';
import ChatBubble from './ChatBubble';

function MessageBox({ toggleChatList }: { toggleChatList: () => void }) {
	const messagesEndRef = useRef<HTMLDivElement | null>(null);
	const { currentConversation, clearCurrentConversation } = useConversations();

	const [isChatListOpen, setIsChatListOpen] = useState(false);

	const scrollToBottom = () => {
		if (messagesEndRef.current?.parentElement) {
			messagesEndRef.current.parentElement.scrollTop =
				messagesEndRef.current.parentElement.scrollHeight;
		}
	};

	const handleToggleChatList = () => {
		toggleChatList();
		setIsChatListOpen(!isChatListOpen);
	};

	const messages =
		currentConversation?.messages.filter(
			(message) => message.content.trim() !== '',
		) || [];

	const totalTokens = useMemo(() => {
		return messages.reduce((sum, message) => sum + message.tokenCount, 0);
	}, [messages]);

	const totalTokensMotion = useMotionValue(0);
	const totalTokensDisplay = useTransform(totalTokensMotion, value => Math.round(value));

	useEffect(() => {
		const controls = animate(totalTokensMotion, totalTokens, { duration: 5 });

		return controls.stop;
	}, [totalTokens]);

	useEffect(scrollToBottom, [messages]);

	scrollToBottom();

	const downloadConversation = () => {
		if (!currentConversation) return;
		const data = JSON.stringify(currentConversation, null, 2);
		const blob = new Blob([data], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.download = `conversation_${currentConversation.id}.json`;
		link.href = url;
		link.click();
		URL.revokeObjectURL(url);
	};

	return (
		<div className='flex flex-col h-full mb-5 overflow-hidden'>
			<div className='flex flex-row items-center p-5 rounded-3xl bg-neutral transition ease-in-out duration-500'>
				<div className='p-2'>
					<button
						type='button'
						className='btn btn-circle btn-ghost text-neutral-content'
						onClick={handleToggleChatList}
						style={{ transform: `rotate(${isChatListOpen ? "90deg" : "0deg"})` }}
					>
						<AiOutlineMenu className='w-5 h-5' />
					</button>
				</div>
				<div className='flex flex-col ml-3 text-neutral-content'>
					<div className='font-semibold text-sm'>
						Total Tokens: <motion.div className="inline-block">{totalTokensDisplay}</motion.div>
					</div>
					<div className='text-xs'>
						Chat ID:{' '}
						{currentConversation ? currentConversation.id : 'No Active Chat'}
					</div>
				</div>
				<div className='ml-auto'>
					<ul className='menu menu-horizontal bg-transparent text-secondary rounded-box'>
						<li>
							<button type='button' onClick={clearCurrentConversation}>
								<HiOutlineTrash className='w-5 h-5' />
							</button>
						</li>
						<li>
							<button type='button' onClick={downloadConversation}>
								<HiInboxArrowDown className='w-5 h-5' />
							</button>
						</li>
					</ul>
				</div>
			</div>

			<div className='flex flex-col h-full p-5 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-xl scrollbar-thumb-secondary transition ease-in-out duration-500'>
				{messages.map((message, index) => (
					<ChatBubble
						key={index}
						role={message.role as 'user' | 'assistant'}
						message={message.content.trim()}
						tokenCount={message.tokenCount}
						id={message.id}
					/>
				))}
				<div ref={messagesEndRef} />
			</div>
		</div>
	);
}

export default MessageBox;
