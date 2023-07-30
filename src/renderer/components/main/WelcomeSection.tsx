import React from 'react';
import { motion } from 'framer-motion';
import { HiFire } from 'react-icons/hi';

const WelcomeSection = () => {
    return (
        <motion.div
            className='px-4 py-8 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <motion.div
                className='max-w-screen-sm sm:text-center sm:mx-auto'
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <motion.a
                    aria-label='View'
                    className='inline-block mb-5 rounded-full sm:mx-auto'
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <motion.div className='flex items-center justify-center w-16 h-16 mb-4 rounded-full'>
                        <HiFire className='w-8 h-8 text-primary' />
                    </motion.div>
                </motion.a>
                <motion.h2
                    className='mb-4 font-sans text-3xl font-bold tracking-tight sm:text-4xl sm:leading-none'
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Welcome to LiteAI
                </motion.h2>
                <motion.p
                    className='text-base md:text-lg sm:px-4'
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Your personal assistant, just the way you want it.
                </motion.p>
                <motion.hr
                    className='w-full my-4'
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    exit={{ scaleX: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                />
            </motion.div>
        </motion.div>
    );
};

export default WelcomeSection;
