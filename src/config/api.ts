import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Debug information
console.log('API Configuration:', {
    API_URL,
    NODE_ENV: process.env.NODE_ENV,
    allEnvVars: process.env
});

if (!API_URL) {
    console.error('REACT_APP_API_URL is not defined in environment variables');
}

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.error('API Error:', {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            });
        } else if (error.request) {
            console.error('Network Error:', {
                message: error.message,
                request: error.request
            });
        } else {
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api; 