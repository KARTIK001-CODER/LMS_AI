const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const sendChatMessage = async (token, message) => {
    const response = await fetch(`${API_BASE_URL}/chat`, {
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
