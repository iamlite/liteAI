// Stats.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { RiOpenaiFill } from 'react-icons/ri';
import { AiFillApi } from 'react-icons/ai';
import { useTiktoken } from '@components/context/TiktokenContext';

const Stats = () => {
    const { getTotalTokenUsage } = useTiktoken();

    return (
        <motion.div
            className='stats shadow scrollbar-none'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
        >
            <motion.div
                className='stat'
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                <div className='stat-figure text-primary'>
                    <RiOpenaiFill className='text-3xl' />
                </div>
                <div className='stat-title'>Total Tokens Used</div>
                <div className='stat-value text-primary'>{getTotalTokenUsage()}</div>
                <div className='stat-desc'>(without context)</div>
            </motion.div>
            <motion.div
                className='stat'
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                <div className='stat-figure text-secondary'>
                    <AiFillApi className='text-3xl' />
                </div>
                <div className='stat-title'>Images Generated</div>
                <div className='stat-value text-secondary'>
                    {window.electron.ipcRenderer.store.get('stats.imagesGenerated')}
                </div>
                <div className='stat-desc'>
                    Estimated Cost:{' '}
                    {(
                        window.electron.ipcRenderer.store.get('stats.imagesGenerated') * 0.018
                    ).toFixed(3)}
                </div>
            </motion.div>
            <motion.div
                className='stat'
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                <div className='stat-figure text-secondary'>
                    <div className='mask mask-squircle'>
                        <div className='w-16 rounded-full '>
                            <img
                                src={window.electron.ipcRenderer.store.get('settings.userAvatar')}
                                alt='Avatar'
                            />
                        </div>
                    </div>
                </div>
                <div className='stat-title'>Current Light Theme:</div>
                <div className='stat-desc text-secondary'>
                    {window.electron.ipcRenderer.store.get('lightMode')}
                </div>
                <div className='stat-title'>Current Dark Theme:</div>
                <div className='stat-desc text-secondary'>
                    {window.electron.ipcRenderer.store.get('darkMode')}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Stats;
