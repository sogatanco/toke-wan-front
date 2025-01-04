import { useState, useEffect } from 'react';
import useAxios from './useAxios'; // Import useAxios

// Hook kustom untuk memeriksa status token dan user
const useCheckUser = (token, navigate) => {
  const [isValid, setIsValid] = useState(null); // Status user valid atau tidak
  const { get } = useAxios(); // Menggunakan hook useAxios untuk request API

  useEffect(() => {
    const checkUser = async () => {
      if (!token) {
        navigate("/login");
        setIsValid(false);
        return;
      }

      try {
        const response = await get("/user", token);
        if (response) {
          localStorage.setItem('user', JSON.stringify(response)); // Menyimpan data user
          setIsValid(true); // Menandakan user valid
        }
      } catch (err) {
        if (err?.response?.status === 401) {
          navigate("/login"); // Jika token invalid, arahkan ke login
        } 
        setIsValid(false); // Menandakan user tidak valid
      }
    };

    checkUser(); // Jalankan pengecekan user saat token berubah
  }, [token, navigate, get]);

  return isValid;
};

export default useCheckUser;
