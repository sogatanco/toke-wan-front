import React, { useState, useEffect } from 'react';
import { Route, Routes as R, Navigate } from 'react-router-dom';
import axios from 'axios';
import NotFound from '../pages/NotFound';
import Dashboard from '../pages/Dashboard';
import Kasir from '../pages/Kasir';
import LoginForm from '../pages/LoginForm';
import ProductListPage from '../pages/ProductListPage';
import NavbarComponent from '../layout/NavbarComponent';

const Routes = () => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nama, setNama]= useState('');

  // Fungsi untuk mengambil role dari API
  const fetchUserRole = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUserRole(null);
        setLoading(false);
        return;
      }

      const response = await axios.get('http://127.0.0.1:8000/api/user', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      });

      setNama(response.data.name);
      setUserRole(response.data.roles); // Set userRole dengan array roles
    } catch (error) {
      console.error('Error fetching user role:', error);
      setError('Failed to fetch user role');
      setUserRole(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRole();
  }, []);

  const ProtectedRoute = ({ role, children }) => {
    // Jika masih loading, tampilkan loading screen
    if (loading) {
      return <div>Loading...</div>;
    }

    // Jika terjadi error, tampilkan error message
    if (error) {
      return <div>{error}</div>;
    }

    // Jika userRole masih null, artinya user belum terautentikasi
    if (!userRole) {
      return <Navigate to="/login" />;
    }

    // Jika role yang diinginkan tidak ada di dalam userRole (array), redirect ke login
    if (role && !userRole.includes(role)) {
      return <Navigate to="/login" />;
    }

    // Jika semua kondisi lulus, tampilkan halaman yang diminta
    return (
      <>
        <NavbarComponent userName={nama} /> {/* Tambahkan Navbar */}
        {children}
      </>
    );
  };

  return (
    <R>
      <Route path="/login" element={<LoginForm />} />
      {/* <Route path="/" element={<Dashboard />} /> */}

      {/* Halaman hanya untuk Admin */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/kasir"
        element={
          <ProtectedRoute role="admin">
            <Kasir />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tambah-produk"
        element={
          <ProtectedRoute role="admin">
            <ProductListPage />
          </ProtectedRoute>
        }
      />

      {/* Jika route tidak ditemukan */}
      <Route path="*" element={<NotFound />} />
    </R>
  );
};

export default Routes;
