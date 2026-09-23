import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export const AdminRoute = () => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
