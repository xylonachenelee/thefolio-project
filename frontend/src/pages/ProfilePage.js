// frontend/src/pages/ProfilePage.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ProfilePage = () => {
    const { user, setUser } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [pic, setPic] = useState(null);
    const [picPreview, setPicPreview] = useState(null);
    const [curPw, setCurPw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [msg, setMsg] = useState('');
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('profile');

    // In ProfilePage.js, update the handleProfile function:
const handleProfile = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');
    
    const fd = new FormData();
    fd.append('name', name);
    fd.append('bio', bio);
    if (pic) {
        fd.append('profilePic', pic);
        console.log('📤 Uploading new profile picture:', pic.name);
    }

    try {
        const { data } = await API.put('/auth/profile', fd, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        console.log('✅ Profile updated:', data);
        setUser(data); // This now uses the updated setUser from AuthContext
        setMsg('Profile updated successfully!');
        
        // Clear the preview after successful upload
        setPic(null);
        setPicPreview(null);
        
        setTimeout(() => setMsg(''), 3000);
    } catch (err) { 
        console.error('❌ Profile update error:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'Error updating profile'); 
    }
};

    const handlePassword = async (e) => {
        e.preventDefault();
        setMsg('');
        setError('');

        if (newPw !== confirmPw) {
            setError('New passwords do not match');
            return;
        }

        if (newPw.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        try {
            await API.put('/auth/change-password', { 
                currentPassword: curPw,
                newPassword: newPw 
            });
            setMsg('Password changed successfully!');
            
            setCurPw('');
            setNewPw('');
            setConfirmPw('');
            
            setTimeout(() => setMsg(''), 3000);
        } catch (err) { 
            setError(err.response?.data?.message || 'Error changing password'); 
        }
    };

    const handlePicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPic(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPicPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <>
            <Navbar />
            <section className="profile-page">
                <div className="car-container">
                    <div className="car">
                        <h2>My Profile</h2>
                        <p>
                            Manage your account settings and change your password.
                        </p>

                        {/* Message Display */}
                        {msg && <div className="success-message">{msg}</div>}
                        {error && <div className="error-message">{error}</div>}

                        {/* Tab Navigation */}
                        <div className="tab-nav">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                            >
                                Profile Information
                            </button>
                            <button
                                onClick={() => setActiveTab('password')}
                                className={`tab-btn ${activeTab === 'password' ? 'active' : ''}`}
                            >
                                Change Password
                            </button>
                        </div>

                        {/* Profile Information Tab */}
                        {activeTab === 'profile' && (
                            <form onSubmit={handleProfile}>
                                {/* Profile Picture */}
                                <div className="profile-pic-container">
                                    <div className="profile-pic">
                                        {picPreview ? (
                                            <img 
                                                src={picPreview} 
                                                alt="Profile preview" 
                                            />
                                        ) : user?.profilePic ? (
                                            <img 
                                                src={`http://localhost:5000/uploads/${user.profilePic}`} 
                                                alt={user.name}
                                            />
                                        ) : (
                                            <div className="profile-pic-placeholder">
                                                {user?.name?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        id="profilePic"
                                        accept="image/*"
                                        onChange={handlePicChange}
                                        style={{ display: 'none' }}
                                    />
                                    <button 
                                        type="button"
                                        className="change-photo-btn"
                                        onClick={() => document.getElementById('profilePic').click()}
                                    >
                                        Change Photo
                                    </button>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="name">Name:</label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email:</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={user?.email || ''}
                                        disabled
                                    />
                                    <small>Email cannot be changed</small>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="bio">Bio:</label>
                                    <textarea
                                        id="bio"
                                        rows="4"
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        placeholder="Tell us about your cooking journey..."
                                    />
                                </div>

                                <button type="submit">Update Profile</button>
                            </form>
                        )}

                        {/* Change Password Tab */}
                        {activeTab === 'password' && (
                            <form onSubmit={handlePassword}>
                                <div className="form-group">
                                    <label htmlFor="currentPassword">Current Password:</label>
                                    <input
                                        type="password"
                                        id="currentPassword"
                                        value={curPw}
                                        onChange={(e) => setCurPw(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="newPassword">New Password:</label>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        value={newPw}
                                        onChange={(e) => setNewPw(e.target.value)}
                                        required
                                        minLength={6}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="confirmPassword">Confirm New Password:</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        value={confirmPw}
                                        onChange={(e) => setConfirmPw(e.target.value)}
                                        required
                                    />
                                </div>

                                <button type="submit">Change Password</button>
                            </form>
                        )}

                        {/* Account Info Box */}
                        <div className="account-info">
                            <p><strong>Account Type:</strong> {user?.role || 'user'}</p>
                            <p><strong>Member since:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'March 2026'}</p>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default ProfilePage;