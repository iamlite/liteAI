import React, { RefObject } from 'react';

interface SnippetsMenuProps {
	visible: boolean;
	buttonRef: RefObject<HTMLButtonElement>;
	onSelect: (snippet: string) => void;
}
// prettier-ignore:start
const snippetsByCategory = {
	Photography: ['headshot', 'posed', 'candid', 'photorealistic', 'soft focus', 'close up', 'sideview', 'eye contact', 'full depth of field', 'shallow depth of field',],
	'Art Style': ['hyper-realistic', 'still-life', 'textured', 'pastel colours', 'painted light', 'bokeh', 'brushstrokes', 'visible brushstrokes',],
	Landscape: ['pastures', 'serene', 'vistas', 'detailed', 'sun light', 'soft light', 'golden hour light',],
	Environments: ['stunning environment', 'wide-angle', 'aerial view', 'landscape painting', 'aerial photography', 'massive scale', 'street level view', 'landscape', 'panoramic', 'lush vegetation', 'idyllic', 'overhead shot',],
	Detail: ['wallpaper', 'poster', 'sharp focus', 'hyperrealism', 'insanely detailed', 'lush detail', 'filigree', 'intricate', 'crystalline', 'perfectionism', 'max detail', '4k uhd', 'spirals', 'tendrils', 'ornate', 'HQ', 'angelic', 'decorations', 'embellishments', 'masterpiece', 'hard edge', 'breathtaking', 'embroidery',],
	Lighting: ['bloom', 'god rays', 'hard shadows', 'studio lighting', 'soft lighting', 'diffused lighting', 'rim lighting', 'volumetric lighting', 'specular lighting', 'cinematic lighting', 'luminescence', 'translucency', 'subsurface scattering', 'global illumination', 'indirect light', 'radiant light rays', 'bioluminescent details', 'ektachrome', 'glowing', 'shimmering light', 'halo', 'iridescent', 'backlighting', 'caustics',],
	Colors: ['vibrant', 'muted colors', 'vivid color', 'post-processing', 'color grading', 'tone mapping', 'lush', 'low contrast', 'vintage', 'aesthetic', 'psychedelic', 'monochrome',],
	'2D Art': ['digital art', 'digital painting', 'trending on artstation', 'golden ratio', 'evocative', 'award winning', 'shiny', 'smooth', 'surreal', 'divine', 'celestial', 'elegant', 'oil painting', 'soft', 'fascinating', 'fine art', 'official art', 'keyvisual', 'color page', 'halftone', 'character design', 'concept art', 'symmetry', 'pixiv fanbox', 'trending on dribbble', 'precise lineart', 'tarot card',],
	'3D Renders & realism': ['unreal engine', 'octane render', 'bokeh', 'vray', 'houdini render', 'quixel megascans', 'arnold render', '8k uhd', 'ray tracing', 'cgi', 'lumen reflections', 'cgsociety', 'ultra realistic', '100mm', 'film photography', 'dslr', 'cinema4d', 'studio quality', 'film grain', 'analog photo', 'polaroid', 'macro photography', 'overglaze', 'volumetric fog', 'depth of field', 'silhouette', 'motion lines', 'motion blur', 'fisheye', 'ultra-wide angle',],
};
// prettier-ignore:end 

const colorClasses = ['badge-primary', 'badge-secondary', 'badge-accent', 'badge-success', 'badge-info', 'badge-warning', 'badge-error', 'badge-outline'];

const SnippetsMenu: React.FC<SnippetsMenuProps> = ({
	visible,
	buttonRef,
	onSelect,
}) => {
	if (!visible) return null;

	const { top, left } = buttonRef.current?.getBoundingClientRect() || {};

	const styles = {
		bottom: `${window.innerHeight - top + window.scrollY}px`,
		left: `${left + window.scrollX}px`,
	};

	let colorIndex = 0; // Initialize color index to 0
	return (
		<div
			className='fixed w-1/3 h-1/2 bg-base-100 border border-base-200 rounded-2xl p-4 overflow-y-auto scrollbar-thin'
			style={styles}
		>
			<div className="sticky top-0 bg-base-200 rounded-xl p-5 my-3">
				<h1 className='text-xl font-bold'>Prompt Helpers</h1>
				<p className='text-sm opacity-75'>Click on a snippet to add it to your prompt.</p>
				<hr className='my-2 opacity-20' />
			</div>
			{Object.entries(snippetsByCategory).map(([category, snippets]) => {
				// Get the current color class for the category
				const currentColorClass = colorClasses[colorIndex];
				// Rotate to the next color class
				colorIndex = (colorIndex + 1) % colorClasses.length;

				return (
					<div key={category}>
						<h4>{category}</h4>
						{snippets.map((snippet) => (
							<div
								key={snippet}
								className={`cursor-pointer badge badge-lg text-xs ${currentColorClass} m-2`}
								onClick={() => onSelect(snippet)}
							>
								{snippet}
							</div>
						))}
					</div>
				);
			})}
		</div>
	);
};

export default SnippetsMenu;