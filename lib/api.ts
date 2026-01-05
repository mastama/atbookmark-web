import axios from 'axios';

// Use environment variable or default to localhost
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // If we use cookies later
});

// Request interceptor to add JWT token
api.interceptors.request.use(
    (config) => {
        // We'll store the token in localStorage with this key
        const token = typeof window !== 'undefined' ? localStorage.getItem('atbookmark_token') : null;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle 401 and Unwrap Data
api.interceptors.response.use(
    (response) => {
        // If backend returns standard format { statusCode, message, data }, return the data part 
        // BUT keep access to other fields if needed? 
        // Actually, making it transparent is easier for now:
        // If we return response.data, the hooks will receive { statusCode, message, data: realData }
        // If we want hooks to receive just realData, we return response.data.data
        // Let's return response directly but user needs to access .data.data?
        // User requested "standard response". 
        // Let's keep axios behavior standard: returns AxiosResponse.
        // The body is in response.data.
        // The body is { statusCode: 200, message: "...", data: { ... } }
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('atbookmark_token');
            }
        }
        return Promise.reject(error);
    }
);

export default api;
