// frontend/src/components/Navbar.js
import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toggleDarkMode } from '../Darkmode';

function Navbar() {
    const location = useLocation();
    const { user, isAuthenticated, logout } = useAuth();
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [logoError, setLogoError] = useState(false);

    // Update dark mode icon based on current theme
    useEffect(() => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        setTheme(currentTheme);
        
        const toggleBtn = document.getElementById('darkModeToggle');
        if (toggleBtn) {
            if (currentTheme === 'dark') {
                toggleBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#000000" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
                toggleBtn.setAttribute('title', 'Switch to Light Mode');
                toggleBtn.classList.add('dark-mode-active');
            } else {
                toggleBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFA500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
                toggleBtn.setAttribute('title', 'Switch to Dark Mode');
                toggleBtn.classList.remove('dark-mode-active');
            }
        }
    }, [location, isAuthenticated]);

    const handleToggleClick = () => {
        toggleDarkMode();
        setTimeout(() => {
            const newTheme = document.documentElement.getAttribute('data-theme') || 'light';
            setTheme(newTheme);
            
            const toggleBtn = document.getElementById('darkModeToggle');
            if (toggleBtn) {
                if (newTheme === 'dark') {
                    toggleBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#000000" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
                    toggleBtn.setAttribute('title', 'Switch to Light Mode');
                    toggleBtn.classList.add('dark-mode-active');
                } else {
                    toggleBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFA500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
                    toggleBtn.setAttribute('title', 'Switch to Dark Mode');
                    toggleBtn.classList.remove('dark-mode-active');
                }
            }
        }, 10);
    };

    const handleLogout = () => {
        logout();
        window.location.href = '/home';
    };

    return (
        <header>
            <div className="nav-container">
                <div className="logo">
                    {!logoError ? (
                        <img 
                            src="/logo.jpg" 
                            alt="cooking logo" 
                            onError={() => setLogoError(true)}
                        />
                    ) : (
                        <div className="logo-fallback">🍳</div>
                    )}
                </div>
                
                {location.pathname === '/home' && (
                    <div className="header-title">
                        <h1>My Cooking Portfolio</h1>
                    </div>
                )}
                
                <nav className={isAuthenticated ? 'nav-logged-in' : 'nav-logged-out'}>
                    <NavLink to="/home" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
                    <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>About</NavLink>
                    
                    {/* Contact - Hide ONLY for admin users */}
                    {!isAuthenticated ? (
                        <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>Contact</NavLink>
                    ) : user?.role === 'admin' ? null : (
                        <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>Contact</NavLink>
                    )}
                    
                    {!isAuthenticated ? (
                        <>
                            <NavLink to="/register" className={({ isActive }) => isActive ? 'active' : ''}>Register</NavLink>
                            <NavLink to="/login" className={({ isActive }) => isActive ? 'active' : ''}>Login</NavLink>
                        </>
                    ) : (
                        <>
                            <NavLink to="/create-post" className={({ isActive }) => isActive ? 'active' : ''}>Write</NavLink>
                            <NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}>Profile</NavLink>
                            {user?.role === 'admin' && (
                                <NavLink to="/admin" className={({ isActive }) => isActive ? 'active' : ''}>Admin</NavLink>
                            )}
                            <button onClick={handleLogout} className="logout-btn-nav">Logout</button>
                        </>
                    )}
                </nav>
                
                <div className="dark-mode-toggle-container">
                    <button 
                        id="darkModeToggle" 
                        className="dark-mode-toggle" 
                        onClick={handleToggleClick}
                        aria-label="Toggle dark mode"
                        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {/* Initial icon will be set by useEffect */}
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Navbar;