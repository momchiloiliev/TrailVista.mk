import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api', // Adjust the baseURL to match your Laravel server
  withCredentials: true, // Include this if you're using Laravel Sanctum for authentication
});

export default apiClient;