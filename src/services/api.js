import axios from 'axios';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://mindflow-backend-s1cw.onrender.com';

axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;

export const setAuthHeader = (token) => {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const removeAuthHeader = () => {
  delete axios.defaults.headers.common.Authorization;
};

const transformAuthResponse = (backendData) => ({
  user: backendData.user,
  accessToken: backendData.accessToken,
});

export const signup = async ({ name, email, password }) => {
  const response = await axios.post('/auth/register', {
    name,
    email,
    password,
  });

  const transformedData = transformAuthResponse(response.data.data);
  setAuthHeader(transformedData.accessToken);
  return { data: transformedData };
};

export const login = async ({ email, password }) => {
  const response = await axios.post('/auth/login', { email, password });
  const transformedData = transformAuthResponse(response.data.data);
  setAuthHeader(transformedData.accessToken);
  return { data: transformedData };
};

export const logout = async () => {
  const response = await axios.post('/auth/logout');
  removeAuthHeader();
  return response;
};

export const refresh = async () => {
  const response = await axios.post('/auth/refresh');
  const responseData = response.data?.data || response.data;
  if (responseData && responseData.accessToken) {
    const transformedData = transformAuthResponse(responseData);
    setAuthHeader(transformedData.accessToken);
    return { data: transformedData };
  } else {
    throw new Error('Missing access token in refresh response');
  }
};

const serviceApi = {
  auth: { signup, login, logout, refresh },
};

export default serviceApi;
