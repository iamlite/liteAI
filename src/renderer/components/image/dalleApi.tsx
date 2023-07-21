interface DALL_E_Settings {
    prompt: string;
    n: number;
    size: string;
}

interface DALL_E_Response {
    url: string;
}

export async function callDALL_E(
    settings: DALL_E_Settings,
    onStreamResponse: (response: DALL_E_Response) => void
) {
    const { prompt, n, size } = settings;

    const requestParameters = {
        prompt,
        n,
        size,
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
                onStreamResponse({ url: imageData.url });
            });
        } else {
            const errorData = await response.json();
            console.error('Error:', errorData);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
