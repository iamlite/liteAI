interface DALL_E_Settings {
    prompt: string;
    n: number;
    size: string;
}

interface DALL_E_Response {
    b64_json: string;
    b64_image: string;
}

let imagesGenerated = 0;
let stats = {};

export default async function callDALL_E(
    settings: DALL_E_Settings,
    onStreamResponse: (response: DALL_E_Response) => void
) {
    const { prompt, n, size } = settings;

    const requestParameters = {
        prompt,
        n,
        size,
        response_format: 'b64_json',
    };
    try {
        const imageGenEndpointURL = window.electron.ipcRenderer.store.get('settings.imageGenEndpointURL');

        const response = await fetch(imageGenEndpointURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${window.electron.ipcRenderer.store.get('settings.openAIKey')}`,
            },
            body: JSON.stringify(requestParameters),
        });
        if (response.ok) {
            const responseData = await response.json();
            console.log('Response Data:', responseData);
            const { data } = responseData;
            data.forEach((imageData: DALL_E_Response) => {
                imagesGenerated += 1;
                stats = {...stats, imagesGenerated};

                window.electron.ipcRenderer.store.set('stats', stats);

                onStreamResponse({
                    b64_image: imageData.b64_json,
                    b64_json: ""
                });
            });
        } else {
            const errorData = await response.json();
            console.error('Error:', errorData);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
