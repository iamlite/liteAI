import React, { useRef, useEffect } from 'react';
import { HiOutlineTrash, HiInboxArrowDown } from 'react-icons/hi2';
import { useConversations } from '../context/ConversationContext';
import ChatBubble from './ChatBubble';

function MessageBox() {
	const messagesEndRef = useRef<HTMLDivElement | null>(null);
	const { currentConversation, clearCurrentConversation } = useConversations();

	const scrollToBottom = () => {
		if (messagesEndRef.current?.parentElement) {
			messagesEndRef.current.parentElement.scrollTop =
				messagesEndRef.current.parentElement.scrollHeight;
		}
	};

	const messages =
		currentConversation?.messages.filter(
			(message) => message.content.trim() !== '',
		) || [];

	useEffect(scrollToBottom, [messages]);

	scrollToBottom();

	return (
		<div className='flex flex-col h-full mb-5 overflow-hidden'>
			<div className='flex flex-row items-center p-5 rounded-3xl bg-neutral transition ease-in-out duration-500'>
				<div className='avatar placeholder'>
					<div className='bg-neutral-focus text-neutral-content rounded-full w-12'>
						<span>MX</span>
					</div>
				</div>
				<div className='flex flex-col ml-3 text-neutral-content'>
					<div className='font-semibold text-sm'>
						Total Tokens: {/* {totalTokens} */}
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
							<button type='button'>
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
					/>
				))}
				<div ref={messagesEndRef} />
			</div>
		</div>
	);
}

export default MessageBox;
