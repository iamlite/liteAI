import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ImgMessageBox from './ImgMessageBox';
import ImageGenerationInput from './ImageGenerationInput';
import { useConversations } from '../context/ConversationContext';
import { useSettings } from '../context/SettingsContext';

const ImgMainContent: React.FC = function ImgMainContentComponent() {
  useConversations();
  useSettings();
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  const handleImageGenerated = (url: string) => {
    setImageUrls((prevUrls) => [...prevUrls, url]);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ width: '100%' }}
    >
      <div className="flex flex-col h-full pb-7 pt-10 px-5">
        <ImgMessageBox imageUrls={imageUrls} loading={loading} />
        <ImageGenerationInput onImageGenerated={handleImageGenerated} setLoading={setLoading}  />
      </div>
    </motion.div>
  );
};

export default ImgMainContent;
