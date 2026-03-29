// frontend/src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // On app load: if a token exists in localStorage, fetch the user's data
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            API.get('/auth/me')
                .then(res => {
                    setUser(res.data);
                    // Optional: You could store user role in localStorage if needed
                    // localStorage.setItem('userRole', res.data.role);
                })
                .catch((error) => {
                    console.error('Auth error:', error);
                    localStorage.removeItem('token'); // remove bad token
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    // login(): call the backend, save token, store user in state
    const login = async (email, password) => {
        try {
            const { data } = await API.post('/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            setUser(data.user);
            return { success: true, user: data.user };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.message || 'Login failed' 
            };
        }
    };

    // register(): new function to handle registration
    const register = async (userData) => {
        try {
            const { data } = await API.post('/auth/register', userData);
            localStorage.setItem('token', data.token);
            setUser(data.user);
            return { success: true, user: data.user };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.message || 'Registration failed' 
            };
        }
    };

    // logout(): clear token and user from memory
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const value = {
        user,
        setUser,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isMember: user?.role === 'member'
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook — use this instead of useContext(AuthContext) everywhere
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};