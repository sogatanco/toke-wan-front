import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const useAxios = () => {
  const navigate = useNavigate();

  // Buat instance axios
  const api = axios.create({
    baseURL: `${process.env.REACT_APP_BASE_URL}api`, // Ganti dengan base URL API Anda
    withCredentials: true,
  });

  // Interceptor request untuk menyertakan token
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Interceptor response untuk menangani error
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token'); // Hapus token jika invalid
        navigate('/login'); // Redirect ke halaman login
      }
      return Promise.reject(error);
    }
  );

  return api;
};

export default useAxios;