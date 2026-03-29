// frontend/src/pages/AdminPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [messages, setMessages] = useState([]);
    const [tab, setTab] = useState('users');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedMessage, setSelectedMessage] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            const [usersRes, postsRes, messagesRes] = await Promise.all([
                API.get('/admin/users'),
                API.get('/admin/posts'),
                API.get('/admin/messages')
            ]);
            setUsers(usersRes.data);
            setPosts(postsRes.data);
            setMessages(messagesRes.data);
        } catch (err) {
            console.error('Admin data fetch error:', err);
            setError(err.response?.data?.message || 'Failed to load admin data');
        } finally {
            setLoading(false);
        }
    };

    // Toggle user active/inactive status
    const toggleUserStatus = async (userId) => {
        try {
            setError('');
            const { data } = await API.put(`/admin/users/${userId}/status`);
            
            setUsers(users.map(u => 
                u._id === userId ? data.user : u
            ));
            
            setSuccess(`User status updated to ${data.user.status}`);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Status toggle error:', err);
            setError(err.response?.data?.message || 'Failed to update user status');
        }
    };

    // Remove post (soft delete - hides from public)
    const removePost = async (postId) => {
        if (!window.confirm('Are you sure you want to remove this post? This will hide it from public view but can be restored later.')) {
            return;
        }
        
        try {
            setError('');
            await API.put(`/admin/posts/${postId}/remove`);
            
            setPosts(posts.map(p => 
                p._id === postId ? { ...p, status: 'removed' } : p
            ));
            
            setSuccess('Post removed successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Post removal error:', err);
            setError(err.response?.data?.message || 'Failed to remove post');
        }
    };

    // Restore post (brings back from removed status)
    const restorePost = async (postId) => {
        if (!window.confirm('Restore this post to public view?')) return;
        
        try {
            setError('');
            await API.put(`/admin/posts/${postId}/restore`);
            
            setPosts(posts.map(p => 
                p._id === postId ? { ...p, status: 'published' } : p
            ));
            
            setSuccess('Post restored successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Post restore error:', err);
            setError(err.response?.data?.message || 'Failed to restore post');
        }
    };

    // PERMANENTLY DELETE POST (for posts only)
    const permanentlyDeletePost = async (postId) => {
        if (!window.confirm('⚠️ WARNING: This will PERMANENTLY DELETE this post and ALL its comments. This action CANNOT be undone!')) {
            return;
        }
        
        try {
            setError('');
            await API.delete(`/admin/posts/${postId}`);
            
            setPosts(posts.filter(p => p._id !== postId));
            
            setSuccess('Post permanently deleted');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Post permanent deletion error:', err);
            setError(err.response?.data?.message || 'Failed to permanently delete post');
        }
    };

    // Delete a message
    const deleteMessage = async (messageId) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;
        
        try {
            setError('');
            await API.delete(`/admin/messages/${messageId}`);
            setMessages(messages.filter(m => m._id !== messageId));
            if (selectedMessage?._id === messageId) {
                setSelectedMessage(null);
            }
            setSuccess('Message deleted successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Message deletion error:', err);
            setError('Failed to delete message');
        }
    };

    // Mark message as read
    const markAsRead = async (messageId) => {
        try {
            await API.put(`/admin/messages/${messageId}/read`);
            setMessages(messages.map(m => 
                m._id === messageId ? { ...m, status: 'read' } : m
            ));
        } catch (err) {
            console.error('Error marking as read:', err);
        }
    };

    const getStatusBadgeClass = (status) => {
        switch(status) {
            case 'active':
            case 'published':
                return 'status-badge active';
            case 'inactive':
                return 'status-badge inactive';
            case 'removed':
                return 'status-badge removed';
            default:
                return 'status-badge';
        }
    };

    const getRoleBadgeClass = (role) => {
        return role === 'admin' ? 'role-badge admin' : 'role-badge user';
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <section className="admin-page">
                    <div className="car-container">
                        <div className="car loading-state">
                            <div className="spinner"></div>
                            <p>Loading admin dashboard...</p>
                        </div>
                    </div>
                </section>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <section className="admin-page">
                <div className="car-container">
                    <div className="car">
                        {/* Admin Profile Section */}
                        <div className="admin-profile-section">
                            <div className="admin-profile-avatar">
                                {user?.profilePic ? (
                                    <img 
                                        src={`http://localhost:5000/uploads/${user.profilePic}`}
                                        alt={user.name}
                                        className="admin-avatar-img"
                                    />
                                ) : (
                                    <div className="admin-avatar-placeholder">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className="admin-profile-info">
                                <h2 className="admin-welcome">Welcome back, {user?.name}!</h2>
                                <div className="admin-role-badge">👑 Administrator</div>
                                <div className="admin-email">{user?.email}</div>
                                <div className="admin-stats-badge">
                                    <span>📅 Admin since: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'March 2026'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="admin-header">
                            <p className="page-description">
                                You have full administrative privileges to manage users, moderate content, and view messages.
                            </p>
                        </div>

                        {error && <div className="error-message">{error}</div>}
                        {success && <div className="success-message">{success}</div>}

                        <div className="admin-tabs">
                            <button
                                onClick={() => setTab('users')}
                                className={`tab-btn ${tab === 'users' ? 'active' : ''}`}
                            >
                                👥 User Management ({users.length})
                            </button>
                            <button
                                onClick={() => setTab('posts')}
                                className={`tab-btn ${tab === 'posts' ? 'active' : ''}`}
                            >
                                📝 Post Moderation ({posts.length})
                            </button>
                            <button
                                onClick={() => setTab('messages')}
                                className={`tab-btn ${tab === 'messages' ? 'active' : ''}`}
                            >
                                📬 Contact Messages ({messages.filter(m => m.status === 'unread').length > 0 ? `(${messages.filter(m => m.status === 'unread').length} new)` : messages.length})
                            </button>
                        </div>

                        {/* Users Tab */}
                        {tab === 'users' && (
                            <div className="admin-table-container">
                                <div className="table-header">
                                    <h3>Manage Users</h3>
                                    <p>Total users: {users.length} | Active: {users.filter(u => u.status === 'active').length} | Inactive: {users.filter(u => u.status === 'inactive').length}</p>
                                </div>
                                
                                {users.length === 0 ? (
                                    <p className="empty-message">No users found.</p>
                                ) : (
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>User</th>
                                                <th>Email</th>
                                                <th>Type</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                            </thead>
                                        <tbody>
                                            {users.map(u => (
                                                <tr key={u._id} className={u.status === 'inactive' ? 'inactive-row' : ''}>
                                                    <td>
                                                        <div className="user-avatar">
                                                            {u.profilePic ? (
                                                                <img 
                                                                    src={`http://localhost:5000/uploads/${u.profilePic}`}
                                                                    alt={u.name}
                                                                />
                                                            ) : (
                                                                <div className="user-avatar-placeholder">
                                                                    {u.name?.charAt(0).toUpperCase()}
                                                                </div>
                                                            )}
                                                            <span>{u.name}</span>
                                                        </div>
                                                    </td>
                                                    <td>{u.email}</td>
                                                    <td>
                                                        <span className={getRoleBadgeClass(u.role)}>
                                                            {u.role === 'admin' ? '👑 Admin' : '👤 User'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={getStatusBadgeClass(u.status)}>
                                                            {u.status || 'active'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="action-buttons">
                                                            <button 
                                                                onClick={() => toggleUserStatus(u._id)}
                                                                className={u.status === 'active' ? 'btn-warning' : 'btn-success'}
                                                                title={u.status === 'active' ? 'Deactivate user' : 'Activate user'}
                                                                disabled={u.role === 'admin' && u._id === user?._id}
                                                            >
                                                                {u.status === 'active' ? '🔴 Deactivate' : '🟢 Activate'}
                                                            </button>
                                                            
                                                            {u.role === 'admin' && u._id === user?._id && (
                                                                <span className="self-badge">(You)</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        )}

                        {/* Posts Tab */}
                        {tab === 'posts' && (
                            <div className="admin-table-container">
                                <div className="table-header">
                                    <h3>Moderate Posts</h3>
                                    <p>Total posts: {posts.length} | Published: {posts.filter(p => p.status === 'published').length} | Removed: {posts.filter(p => p.status === 'removed').length}</p>
                                </div>
                                
                                {posts.length === 0 ? (
                                    <p className="empty-message">No posts found.</p>
                                ) : (
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Title</th>
                                                <th>Author</th>
                                                <th>Date</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                            </thead>
                                        <tbody>
                                            {posts.map(p => (
                                                <tr key={p._id} className={p.status === 'removed' ? 'removed-row' : ''}>
                                                    <td>
                                                        <Link to={`/post/${p._id}`} className="post-link" target="_blank">
                                                            {p.title}
                                                        </Link>
                                                    </td>
                                                    <td>
                                                        <div className="author-cell">
                                                            {p.author?.role === 'admin' ? '👑 ' : '👤 '}
                                                            {p.author?.name || 'Unknown'}
                                                        </div>
                                                    </td>
                                                    <td>{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'N/A'}</td>
                                                    <td>
                                                        <span className={getStatusBadgeClass(p.status)}>
                                                            {p.status || 'published'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="action-buttons">
                                                            {p.status === 'published' ? (
                                                                <button 
                                                                    className="btn-warning"
                                                                    onClick={() => removePost(p._id)}
                                                                    title="Remove post from public view"
                                                                >
                                                                    🚫 Remove
                                                                </button>
                                                            ) : (
                                                                <button 
                                                                    className="btn-success"
                                                                    onClick={() => restorePost(p._id)}
                                                                    title="Restore post to public view"
                                                                >
                                                                    🔄 Restore
                                                                </button>
                                                            )}
                                                            
                                                            <button 
                                                                className="btn-danger"
                                                                onClick={() => permanentlyDeletePost(p._id)}
                                                                title="PERMANENTLY DELETE this post"
                                                            >
                                                                🗑️ Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        )}

                        {/* Messages Tab */}
                        {tab === 'messages' && (
                            <div className="admin-messages-container">
                                <div className="table-header">
                                    <h3>Contact Messages</h3>
                                    <p>Total messages: {messages.length} | Unread: {messages.filter(m => m.status === 'unread').length} | Read: {messages.filter(m => m.status === 'read').length}</p>
                                </div>
                                
                                {messages.length === 0 ? (
                                    <p className="empty-message">No messages yet. Messages from the contact form will appear here.</p>
                                ) : (
                                    <div className="messages-layout">
                                        <div className="messages-list">
                                            {messages.map(message => (
                                                <div 
                                                    key={message._id} 
                                                    className={`message-item ${message.status === 'unread' ? 'unread' : ''}`}
                                                    onClick={() => {
                                                        setSelectedMessage(message);
                                                        if (message.status === 'unread') {
                                                            markAsRead(message._id);
                                                        }
                                                    }}
                                                >
                                                    <div className="message-header">
                                                        <div className="message-sender">
                                                            <strong>{message.name}</strong>
                                                            <span className="message-email">({message.email})</span>
                                                        </div>
                                                        <div className="message-date">
                                                            {new Date(message.createdAt).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                    <div className="message-subject">
                                                        Subject: {message.subject}
                                                    </div>
                                                    <div className="message-preview">
                                                        {message.message.substring(0, 80)}...
                                                    </div>
                                                    {message.status === 'unread' && (
                                                        <div className="unread-badge">New</div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {selectedMessage && (
                                            <div className="message-detail">
                                                <div className="message-detail-header">
                                                    <h3>Message Details</h3>
                                                    <button 
                                                        className="close-detail"
                                                        onClick={() => setSelectedMessage(null)}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                                <div className="message-detail-content">
                                                    <p><strong>From:</strong> {selectedMessage.name}</p>
                                                    <p><strong>Email:</strong> {selectedMessage.email}</p>
                                                    <p><strong>Subject:</strong> {selectedMessage.subject}</p>
                                                    <p><strong>Date:</strong> {new Date(selectedMessage.createdAt).toLocaleString()}</p>
                                                    <hr />
                                                    <p><strong>Message:</strong></p>
                                                    <p className="full-message">{selectedMessage.message}</p>
                                                </div>
                                                <div className="message-detail-actions">
                                                    <button 
                                                        className="btn-danger"
                                                        onClick={() => deleteMessage(selectedMessage._id)}
                                                    >
                                                        Delete Message
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="summary-cards">
                            <div className="summary-card">
                                <h3>Total Users</h3>
                                <p>{users.length}</p>
                                <small>Active: {users.filter(u => u.status === 'active').length}</small>
                            </div>
                            <div className="summary-card">
                                <h3>Total Posts</h3>
                                <p>{posts.length}</p>
                                <small>Published: {posts.filter(p => p.status === 'published').length}</small>
                            </div>
                            <div className="summary-card">
                                <h3>Unread Messages</h3>
                                <p>{messages.filter(m => m.status === 'unread').length}</p>
                                <small>Total: {messages.length}</small>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default AdminPage;