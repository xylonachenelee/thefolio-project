// frontend/src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { initializeTheme } from './Darkmode';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// Pages - Phase 1 (Your existing pages)
import Splash from './pages/SplashPage';
import Home from './pages/HomePage';
import About from './pages/AboutPage';
import Contact from './pages/ContactPage';
import Register from './pages/RegisterPage';

// Pages - Phase 2 (New pages)
import LoginPage from './pages/LoginPage';
import PostPage from './pages/PostPage';
import ProfilePage from './pages/ProfilePage';
import CreatePostPage from './pages/CreatePostPage';
import EditPostPage from './pages/EditPostPage';
import AdminPage from './pages/AdminPage';

function AppContent() {
  useEffect(() => {
    initializeTheme();
  }, []);

  return (
    <>
      <Routes>
        {/* Public routes — anyone can visit */}
        {/* Phase 1 Routes - ALL KEPT */}
        <Route path="/" element={<Splash />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<Register />} />
        
        {/* Phase 2 Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/post/:id" element={<PostPage />} />
        
        {/* Protected routes — must be logged in */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        
        <Route path="/create-post" element={
          <ProtectedRoute>
            <CreatePostPage />
          </ProtectedRoute>
        } />
        
        <Route path="/edit-post/:id" element={
          <ProtectedRoute>
            <EditPostPage />
          </ProtectedRoute>
        } />
        
        {/* Admin only routes */}
        <Route path="/admin" element={
          <ProtectedRoute role="admin">
            <AdminPage />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;