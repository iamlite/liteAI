import React, { RefObject } from 'react';

interface SnippetsMenuProps {
	visible: boolean;
	buttonRef: RefObject<HTMLButtonElement>;
	onSelect: (snippet: string) => void;
}

const snippetsByCategory = {
	"Conversation Starters": [
		"Explain [complex topic] to me like I'm 5, using simple examples and analogies.",
		"Help me find errors in the following code: [code snippet].",
		"Provide a step-by-step approach for solving [specific problem or challenge].",
		"I'm interested in learning about [insert topic]. Can you share the most important 20% of learnings to understand 80% of it?",
		"What are the key factors to consider when [specific task or decision]?",
		"Recommend a good book/resource for learning more about [insert topic].",
		"Share some interesting facts about [topic]."
	],
	"Code Assistance": [
		"Can you help me debug this code snippet: [code snippet]?",
		"I need guidance on implementing [specific feature] in my code.",
		"Explain the concept of [programming concept] with an example.",
		"Suggest an algorithm/approach to solve [coding problem].",
		"What is the best practice for handling [specific coding scenario]?",
		"How do I optimize this code for better performance?",
		"Recommend a library or tool for [specific task].",
		"Can you explain the error message: [error message]?"
	],
	"Learning Support": [
		"Explain the difference between [topic A] and [topic B].",
		"What are the pros and cons of using [technology/programming language]?",
		"Help me understand the concept of [specific topic].",
		"What are some real-world applications of [technology/concept]?",
		"I'm having trouble with [subject]. Can you provide some resources or tutorials to study?",
		"What are the best practices for [specific area of coding/development]?",
		"Explain the concept of [technical term] in simple terms.",
		"How can I improve my skills in [specific programming language/technology]?"
	],
};

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

	let colorIndex = 0;
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
				const currentColorClass = colorClasses[colorIndex];
				colorIndex = (colorIndex + 1) % colorClasses.length;
				return (
					<div key={category}>
						<h4>{category}</h4>
						{snippets.map((snippet) => (
							<div
								key={snippet}
								className={`cursor-pointer badge badge-lg h-full py-1 text-xs ${currentColorClass} m-2`}
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