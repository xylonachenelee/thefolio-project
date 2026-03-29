// frontend/src/api/axios.js
import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5000/api', // Keep as is from guide
    headers: {
        'Content-Type': 'application/json'
    }
});

// This interceptor runs before EVERY request.
// It reads the token from localStorage and adds it to the Authorization header.
instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Optional: Add response interceptor for better error handling
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle token expiration
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            // You can add a redirect to login here if needed
            // but we'll handle this in AuthContext
        }
        return Promise.reject(error);
    }
);

export default instance;