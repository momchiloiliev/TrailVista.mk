import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
  withXSRFToken: true,
  xsrfHeaderName: "X-XSRF-TOKEN",
  xsrfCookieName: "XSRF-TOKEN",
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

const getCsrfToken = async () => {
  await api.get('/sanctum/csrf-cookie');
};

export const logout = async () => {
  await api.post('/api/logout');
};

export const loginUser = async (email: string, password: string, remember: boolean) => {
  try {
    await getCsrfToken();
    const response = await api.post('/api/login', {
      email,
      password,
      remember
    });
    getCurrentUser(); 
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || 'An error occurred');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};


export const registerUser = async (name: string, email: string, password: string, password_confirmation: string) => {
  try {
    await getCsrfToken();
    const response = await api.post('/api/register', {
      name,
      email,
      password,
      password_confirmation
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || 'An error occurred');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};




export const getCurrentUser = async () => {
  try {
    const response = await api.get('/api/user',{
      withCredentials:true,
    });
    console.log(response); 
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};


export const getUserReviews = async (userId: number) => {
  try {
    const response = await api.get(`/api/users/${userId}/reviews`);
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};



export const updateUser = async (userData: FormData) => {
  try {

    userData.append('_method', 'PUT');
    const response = await api.post('/api/profile', userData, {
      headers: {
        'Content-Type': 'multipart/form-data',
            },
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};


export const createPost = async (postData: FormData) => {
  try {
    await getCsrfToken();
    const response = await api.post('/api/posts', postData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};


export const getGpxFile = async (filePath: string) => {
  try {
    const response = await api.get(`storage/${filePath}`, {
      responseType: 'text',
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const addToFavorites = async (postId: number) => {
  try {
    const response = await api.post(`/api/favorites/${postId}`);
    return response.data;
  } catch (error) {
    console.error('Error adding to favorites:', error);
  }
};

export const removeFromFavorites = async (postId: number) => {
  try {
    const response = await api.delete(`/api/favorites/${postId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing from favorites:', error);
  }
};

export const getFavorites = async () => {
  try {
    const response = await api.get('/api/favorites');
    return response.data;
  } catch (error) {
    console.error('Error fetching favorites:', error);
  }
};

export const getMostFavorites = async () => {
  try {
    const response = await api.get('/api/most-favorited-routes');
    return response.data;
  } catch (error) {
    console.error('Error fetching favorites:', error);
  }
};