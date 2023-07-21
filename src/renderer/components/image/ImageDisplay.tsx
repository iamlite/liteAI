import React from 'react';

interface ImageDisplayProps {
	url: string;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ url }) => {
	return (
		<div>
			<img src={url} alt='Generated' />
		</div>
	);
};

export default ImageDisplay;
