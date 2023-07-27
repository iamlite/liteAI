import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

interface AnimatedButtonProps {
    id: string;
    className: string;
    onClick?: (event?: React.MouseEvent) => void;
    children: React.ReactNode;
}

const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
    ({ id, className, onClick, children }, ref) => (
        <motion.button
            id={id}
            ref={ref}
            type='button'
            className={className}
            onClick={onClick}
            whileHover={{ scale: [null, 1.5, 1.3, 1.4] }}
            transition={{ duration: 0.3 }}
            whileTap={{ scale: 0.9 }}>
            {children}
        </motion.button>
    ),
);

AnimatedButton.displayName = 'AnimatedButton';

export default AnimatedButton;
