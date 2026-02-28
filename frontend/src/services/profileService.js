const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem('token');
            throw new Error('Unauthorized');
        }
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || err.message || 'Failed to fetch profile');
    }

    return response.json();
};
