/* eslint-disable react/no-unknown-property */
// WebviewTab.tsx
import React from 'react';
import { motion } from 'framer-motion';

const WebviewTab: React.FC = function WebViewComponent() {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="flex" style={{ width: '100%', height: '100%' }} >
            <div className="flex flex-col flex-grow pb-7 pt-10 px-5">
                <h1> Webview </h1>
                <iframe
                    src="https://www.google.com"
                    style={{ width: '100%', height: '100%', border: 'none' }}
                ></iframe>
            </div>
        </motion.div>
    );
};

export default WebviewTab;
