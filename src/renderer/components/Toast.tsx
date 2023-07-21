import React, { useEffect, useState } from 'react';
import { animated, useSpring } from '@react-spring/web';
import {
	AiFillCloseCircle,
	AiFillExclamationCircle,
	AiFillCheckCircle,
	AiFillInfoCircle,
} from 'react-icons/ai';

interface ToastProps {
	message: string;
	type?: 'success' | 'danger' | 'warning' | 'default';
	onDismiss: () => void;
	index: number;
}

const typeStyles: Record<string, string> = {
	success: 'alert-success',
	danger: 'alert-error',
	warning: 'alert-warning',
	default: 'alert-info',
};

const typeIcons: Record<string, React.JSX.Element> = {
	success: <AiFillCheckCircle className='w-5 h-5' />,
	danger: <AiFillCloseCircle className='w-5 h-5' />,
	warning: <AiFillExclamationCircle className='w-5 h-5' />,
	default: <AiFillInfoCircle className='w-5 h-5' />,
};

function Toast({ message, type = 'default', onDismiss, index }: ToastProps) {
	const [isOpen, setIsOpen] = useState(true);

	const toastStyles = useSpring({
		from: { opacity: 0, transform: 'translateY(-100%)' },
		to: {
			opacity: isOpen ? 1 : 0,
			transform: isOpen ? 'translateY(0%)' : 'translateY(100%)',
		},
		onRest: () => !isOpen && onDismiss(),
	});

	const top = `${index * 4 + 4}rem`;

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsOpen(false);
		}, 3000);

		return () => clearTimeout(timer);
	}, []);

	return (
		<div className='toast toast-top toast-end opacity-75'>
			<animated.div
				style={{ ...toastStyles, top }}
				className={`alert ${typeStyles[type] || typeStyles.default}`}
				role='alert'>
				{typeIcons[type]}
				<span>{message}</span>
				<button
					type='button'
					onClick={() => setIsOpen(false)}
					className='btn btn-ghost'
					aria-label='Close'>
					<AiFillCloseCircle className='w-5 h-5' />
				</button>
			</animated.div>
		</div>
	);
}

Toast.defaultProps = {
	type: 'default',
};

export default Toast;
