// ActionButtons.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { AiFillWechat, AiOutlineArrowRight, AiOutlinePicture } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const ActionButtons = () => {
    const navigate = useNavigate();

    const handleTextClick = () => {
        navigate('/text');
    };

    const handleimgClick = () => {
        navigate('/img');
    };

    return (
        <motion.div
            className='flex flex-row px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
        >
            <motion.button
                type='button'
                className='card text-left w-96 bg-base-100 shadow-xl px-2 mx-2 rounded-2xl relative overflow-hidden'
                onClick={handleTextClick}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                <AiFillWechat className='absolute top-0 bottom-0 left-0 right-0 w-[150%] h-[120%] z-10 opacity-5' />
                <motion.div className='card-body z-20 relative'>
                    <motion.h2 className='card-title text-primary'>Start a Chat</motion.h2>
                    <motion.p>
                        Ask a question or give your personal assistant a task to get started. Or just say Hello!
                    </motion.p>
                </motion.div>
                <motion.div className='absolute bottom-3 right-3 w-6 h-6 text-secondary z-20'>
                    <AiOutlineArrowRight />
                </motion.div>
            </motion.button>

            <motion.button
                type='button'
                className='card text-left w-96 bg-base-100 shadow-xl px-2 mx-2 rounded-2xl relative overflow-hidden'
                onClick={handleimgClick}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                <AiOutlinePicture className='absolute top-0 bottom-0 left-0 right-0 w-[150%] h-[130%] z-10 opacity-5' />
                <motion.div className='card-body z-20 relative'>
                    <motion.h2 className='card-title text-secondary'>
                        Generate an Image <span className='text-primary'>(Beta)</span>
                    </motion.h2>
                    <motion.p>
                        Generate stunning images with just a few clicks. Your creativity is the only limit.
                    </motion.p>
                </motion.div>
                <motion.div className='absolute bottom-3 right-3 w-6 h-6 text-secondary z-20'>
                    <AiOutlineArrowRight />
                </motion.div>
            </motion.button>
        </motion.div>
    );
};

export default ActionButtons;
