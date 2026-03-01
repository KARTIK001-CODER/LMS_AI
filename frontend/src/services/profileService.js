import { API_BASE } from '../config';

const authHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    };
};

export const getProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const response = await fetch(`${API_BASE}/profile`, {
        method: 'GET',
        headers: authHeaders(),
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

export const updatePersonal = async (data) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const response = await fetch(`${API_BASE}/profile/personal`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(data),
    });

    const json = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(json.error || json.message || 'Failed to update personal info');
    }
    return json;
};

export const updateEducation = async (data) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const response = await fetch(`${API_BASE}/profile/education`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(data),
    });

    const json = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(json.error || json.message || 'Failed to update education details');
    }
    return json;
};
