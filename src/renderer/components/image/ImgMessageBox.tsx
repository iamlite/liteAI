import React from 'react';
import { HiOutlineTrash, HiInboxArrowDown } from 'react-icons/hi2';
import ImageDisplay from './ImageDisplay';

interface ImgMessageBoxProps {
  imageUrls: string[];
}

function ImgMessageBox({ imageUrls }: ImgMessageBoxProps) {
  return (
    <div className="flex flex-col h-full mb-5 overflow-hidden">
      <div className="flex flex-row items-center p-5 rounded-3xl bg-neutral transition ease-in-out duration-500">
        <div className="avatar placeholder">
          <div className="bg-neutral-focus text-neutral-content rounded-full w-12">
            <span>MX</span>
          </div>
        </div>
        <div className="flex flex-col ml-3 text-neutral-content">
          <div className="font-semibold text-sm">
            DALL-E 2 Image Generator
          </div>
          <div className="text-xs">
            Chat ID: {/* {chatId} */}
          </div>
        </div>
        <div className="ml-auto">
          <ul className="menu menu-horizontal bg-transparent text-secondary rounded-box">
            <li>
              <button type="button">
                <HiOutlineTrash className="w-5 h-5" />
              </button>
            </li>
            <li>
              <button type="button">
                <HiInboxArrowDown className="w-5 h-5" />
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col h-full px-5 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-xl scrollbar-thumb-secondary transition ease-in-out duration-500">
        {imageUrls.map((url, index) => (
          <ImageDisplay key={index} url={url} />
        ))}
      </div>
    </div>
  );
}

export default ImgMessageBox;
