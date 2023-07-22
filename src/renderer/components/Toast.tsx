import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
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
	const controls = useAnimation();

	const top = `${index * 4 + 4}rem`;

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsOpen(false);
		}, 3000);

		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		if (isOpen) {
			controls.start({
				opacity: 1,
				y: 0,
			});
		} else {
			controls
				.start({
					opacity: 0,
					y: '100%',
				})
				.then(onDismiss);
		}
	}, [isOpen, controls, onDismiss]);

	return (
		<div className='toast toast-top toast-end opacity-75'>
			<motion.div
				initial={{ opacity: 0, y: '-100%' }}
				animate={controls}
				exit={{ opacity: 0, y: '100%' }}
				style={{ top }}
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
			</motion.div>
		</div>
	);
}

Toast.defaultProps = {
	type: 'default',
};

export default Toast;
