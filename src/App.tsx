import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useGameStore } from './store/gameStore';
import Login from './pages/Login';
import GameList from './pages/GameList';
import GameChat from './pages/GameChat';
import ProtectedRoute from './components/ProtectedRoute';

/**
 * Main App component with routing configuration
 */
function App() {
  const isAuthenticated = useGameStore(state => state.isAuthenticated);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Login Route */}
          <Route 
            path="/" 
            element={
              isAuthenticated ? <Navigate to="/games" replace /> : <Login />
            } 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/games" 
            element={
              <ProtectedRoute>
                <GameList />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/game/:gameId" 
            element={
              <ProtectedRoute>
                <GameChat />
              </ProtectedRoute>
            } 
          />
          
          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        {/* Toast Notifications */}
        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              background: 'rgba(15, 23, 42, 0.9)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)'
            }
          }}
        />
      </div>
    </Router>
  );
}

export default App;
