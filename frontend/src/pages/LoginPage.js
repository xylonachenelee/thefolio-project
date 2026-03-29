// frontend/src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const result = await login(email, password);
            
            if (result.success) {
                navigate(result.user.role === 'admin' ? '/admin' : '/home');
            } 
            else {
                setError(result.error || 'Login failed. Please try again.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Navbar />
            <section className="login-page">
                <div className="car-container">
                    <div className="car">
                        <h2>Login to Cooking XCR</h2>
                        <p>
                            Welcome back! Please login to access your account and manage your cooking posts.
                        </p>
                        
                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="email">Email Address:</label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="email@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password:</label>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            <button 
                                type="submit" 
                                className="login-btn"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Logging in...' : 'Login'}
                            </button>
                        </form>

                        <div className="register-prompt">
                            <p>
                                Don't have an account yet?
                            </p>
                            <Link to="/register">
                                <button>
                                    Create an Account
                                </button>
                            </Link>
                        </div>

                        {/* Demo credentials hint (optional - remove in production) */}
                        <div className="demo-credentials">
                            <p>
                                <strong>Demo Credentials:</strong>
                            </p>
                            <p>Admin: admin@example.com / admin123</p>
                            <p>User: user@example.com / user123</p>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default LoginPage;