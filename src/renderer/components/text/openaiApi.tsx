import { Message } from '@components/context/ConversationContext';
import { v4 as uuidv4 } from 'uuid';

interface Settings {
	openAIKey: string;
	modelName: string;
	maxTokens: number;
	temperature: number;
	frequencyPenalty: number;
	presencePenalty: number;
	endpointURL: string;
	initialPrompt: string;
}

let controller: AbortController | null = null;
let loggedForCurrentMessage = false;

async function readResponse(
	reader: ReadableStreamDefaultReader<Uint8Array>,
	decoder: TextDecoder,
): Promise<string | null> {
	const { done, value } = await reader.read();
	if (done) {
		return null;
	}
	const chunk = decoder.decode(value);
	return chunk;
}

let currentMessageId: string | null = null;

async function processChunk(
	chunk: string,
	onStreamResponse: (response: {
		id: string;
		role: string;
		content: string;
	}) => void,
) {
	let data = '';
	const lines = chunk.split('\n');
	lines.forEach((line) => {
		if (line.startsWith('data: ')) {
			data += line.slice(6);
		} else if (line === '') {
			if (data === '[DONE]') {
				onStreamResponse({
					role: 'assistant',
					content: '[DONE]',
					id: currentMessageId || '',
				});
				loggedForCurrentMessage = false;
				currentMessageId = null;
				return;
			}
			if (data !== '') {
				const parsedData = JSON.parse(data);
				const { choices } = parsedData;
				const { delta } = choices[0];
				const { content } = delta;

				if (!loggedForCurrentMessage) {
					currentMessageId = uuidv4();
					console.log('ID: ', currentMessageId);
					console.log(
						'Created: ',
						new Date(parsedData.created * 1000).toLocaleString(),
					);
					if (parsedData.usage) {
						console.log('Usage: ', parsedData.usage);
					}
					console.groupEnd();
					loggedForCurrentMessage = true;
				}

				if (content) {
					onStreamResponse({
						id: currentMessageId,
						role: 'assistant',
						content,
					});
				}
			}
			data = '';
		}
	});
}

let currentResponseReader: ReadableStreamDefaultReader<Uint8Array> | null =
	null;
export async function callOpenAI(
	messages: Message[],
	settings: Settings,
	onStreamResponse: (response: Message) => void,
) {
	controller = new AbortController();
	const { signal } = controller;

	// Ensure correct types
	const modelName = String(settings.modelName);
	let maxTokens = Number(settings.maxTokens);
	maxTokens = isNaN(maxTokens) ? 0 : Math.floor(maxTokens);
	let temperature = Number(settings.temperature);
	temperature = isNaN(temperature) ? 0 : temperature;
	let frequencyPenalty = Number(settings.frequencyPenalty);
	frequencyPenalty = isNaN(frequencyPenalty) ? 0 : frequencyPenalty;
	let presencePenalty = Number(settings.presencePenalty);
	presencePenalty = isNaN(presencePenalty) ? 0 : presencePenalty;


	const {
		endpointURL,
		initialPrompt,
	} = settings;

	const requestMessages = messages.map(({ role, content }) => ({
		role,
		content,
	}));

	const requestParameters = {
		model: modelName,
		messages:
			initialPrompt && initialPrompt.trim() !== ''
				? [{ role: 'system', content: initialPrompt }, ...requestMessages]
				: requestMessages,
		max_tokens: maxTokens,
		temperature,
		frequency_penalty: frequencyPenalty,
		presence_penalty: presencePenalty,
		stream: true,
	};

	console.group('%cOpenAI API', 'font-weight: bold;');

	try {
		console.group('Request parameters');
		console.log('Endpoint:', endpointURL);
		console.log('Model:', modelName);
		console.log('Max Tokens:', maxTokens);
		console.log('Temperature:', temperature.toFixed(1));
		console.log('Frequency Penalty:', frequencyPenalty.toFixed(1));
		console.log('Presence Penalty:', presencePenalty.toFixed(1));
		console.log('Initial Prompt:', initialPrompt);
		console.groupEnd();

		const response = await fetch(endpointURL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${settings.openAIKey}`,
			},
			body: JSON.stringify(requestParameters),
			signal,
		});

		console.group('Response');
		console.log('Response status:', response.status);
		console.log('Response headers:', response.headers);

		if (response.ok) {
			const reader =
				response.body!.getReader() as ReadableStreamDefaultReader<Uint8Array>;
			const decoder = new TextDecoder('utf-8');

			currentResponseReader = reader;

			const processData = async () => {
				const chunk = await readResponse(reader, decoder);
				if (chunk) {
					await processChunk(chunk, onStreamResponse);
					processData();
				}
			};

			await processData();
		} else {
			const errorData = await response.json();
			console.error('Error:', errorData);
		}
	} catch (error) {
		if (signal.aborted) {
			console.log('Request aborted.');
		} else {
			console.error('Error:', error);
		}
	} finally {
		console.groupEnd();
		controller = null;
	}
}

export function stopOpenAI() {
	if (controller) {
		controller.abort();
		controller = null;
	}
	if (currentResponseReader) {
		currentResponseReader.cancel();
		currentResponseReader = null;
	}
}
