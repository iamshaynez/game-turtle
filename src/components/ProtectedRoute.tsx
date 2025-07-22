import React from 'react';
import { Navigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Protected route component that requires authentication
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useGameStore(state => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}