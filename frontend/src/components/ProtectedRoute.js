// frontend/src/components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Usage:
// <ProtectedRoute> → requires any logged-in user
// <ProtectedRoute adminOnly> → requires admin role
// <ProtectedRoute role='admin'> → alternative syntax if you prefer

const ProtectedRoute = ({ children, role, adminOnly = false }) => {
    const { user, loading } = useAuth();

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: 'linear-gradient(135deg, #d3dcba 0%, #6b8464 100%)',
                color: 'white',
                fontSize: '20px'
            }}>
                Loading...
            </div>
        );
    }

    // If no user, redirect to login
    if (!user) {
        return <Navigate to='/login' replace />;
    }

    // Check for admin requirements (supports both role prop and adminOnly prop)
    const requiredRole = role || (adminOnly ? 'admin' : null);
    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to='/' replace />;
    }

    // User is authorized, render the protected component
    return children;
};

export default ProtectedRoute;