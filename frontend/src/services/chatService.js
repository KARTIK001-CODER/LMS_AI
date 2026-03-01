import { API_BASE } from '../config';

export const sendChatMessage = async (token, message) => {
    const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Chat service failed');
    }

    return data;
};
