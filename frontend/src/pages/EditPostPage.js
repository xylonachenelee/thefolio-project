// frontend/src/pages/EditPostPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const EditPostPage = () => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState(''); // Changed from 'body' to 'content'
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [currentImage, setCurrentImage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    
    const { user } = useAuth();
    const navigate = useNavigate();
    const BACKEND_URL = process.env.REACT_APP_API_URL?.replace('/api', '');

    const fetchPost = useCallback(async () => {
        console.log('🔍 Fetching post with ID:', id);
        
        if (!id) {
            setError('No post ID provided');
            setLoading(false);
            return;
        }
        
        try {
            const response = await API.get(`/posts/${id}`);
            console.log('✅ Post data:', response.data);
            const post = response.data;
            
            setTitle(post.title);
            setContent(post.content); // Make sure this matches your backend field
            if (post.image) {
                setCurrentImage(post.image);
                console.log('🖼️ Current image:', post.image);
            }
            
            // Check authorization
            if (user && post.author?._id !== user._id && user.role !== 'admin') {
                setError('You are not authorized to edit this post');
                setTimeout(() => navigate('/home'), 2000);
            }
            
        } catch (err) {
            console.error('❌ Error fetching post:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Failed to load post. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [id, user, navigate]);

    useEffect(() => {
        fetchPost();
    }, [fetchPost]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log('📸 New image selected:', file.name, file.type, file.size);
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content); // Make sure this matches backend
        if (image) {
            formData.append('image', image); // This must match the field name in upload.single('image')
            console.log('📤 Appending new image to FormData:', image.name);
        } else {
            console.log('📤 No new image, keeping current image');
        }

        // Log FormData for debugging
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + (pair[0] === 'image' ? 'File: ' + pair[1].name : pair[1]));
        }

        try {
            const response = await API.put(`/posts/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('✅ Post updated:', response.data);
            navigate(`/post/${response.data._id}`);
        } catch (err) { 
            console.error('❌ Update error:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Failed to update post');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteConfirm) {
            setDeleteConfirm(true);
            return;
        }

        try {
            await API.delete(`/posts/${id}`);
            navigate('/home');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete post');
            setDeleteConfirm(false);
        }
    };

    const cancelDelete = () => {
        setDeleteConfirm(false);
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <section className="edit-post-page">
                    <div className="car-container">
                        <div className="car loading-state">
                            <div className="spinner"></div>
                            <p>Loading post...</p>
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
            <section className="edit-post-page">
                <div className="car-container">
                    <div className="car" style={{ maxWidth: '800px' }}>
                        <h2>Edit Post</h2>
                        <p className="page-description">
                            Make changes to your post and publish when you're ready.
                        </p>

                        {error && <div className="error-message">{error}</div>}

                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            <div className="form-group">
                                <label htmlFor="title">Post Title:</label>
                                <input
                                    type="text"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g., My First Adobo Recipe"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="content">Content:</label>
                                <textarea
                                    id="content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Write your post here... Share your recipe, tips, or cooking story"
                                    rows={12}
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            {currentImage && !imagePreview && (
                                <div className="form-group">
                                    <label>Current Image:</label>
                                    <div className="current-image">
                                        <img 
                                            src={`${BACKEND_URL}/uploads/${currentImage}`}
                                            alt="Current post"
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '200px',
                                                borderRadius: '10px',
                                                border: '2px solid #d98859',
                                                boxShadow: '0 3px 10px rgba(0,0,0,0.1)'
                                            }}
                                            onError={(e) => {
                                                console.error('❌ Failed to load image:', currentImage);
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="form-group">
                                <label htmlFor="image">
                                    {currentImage ? 'Change Image (Optional)' : 'Add Image (Optional)'}:
                                </label>
                                <input
                                    type="file"
                                    id="image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    disabled={isSubmitting}
                                />
                                <small>Leave empty to keep current image</small>
                                
                                {imagePreview && (
                                    <div className="image-preview">
                                        <p>New Image Preview:</p>
                                        <img 
                                            src={imagePreview} 
                                            alt="Preview" 
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '300px',
                                                borderRadius: '10px',
                                                border: '2px solid #d98859',
                                                boxShadow: '0 3px 10px rgba(0,0,0,0.1)'
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="action-buttons">
                                <button 
                                    type="submit" 
                                    className="update-btn"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Updating...' : '📝 Update Post'}
                                </button>

                                {!deleteConfirm ? (
                                    <button 
                                        type="button"
                                        className="delete-btn"
                                        onClick={handleDelete}
                                        disabled={isSubmitting}
                                    >
                                        🗑️ Delete
                                    </button>
                                ) : (
                                    <>
                                        <button 
                                            type="button"
                                            className="confirm-delete-btn"
                                            onClick={handleDelete}
                                            disabled={isSubmitting}
                                        >
                                            ✓ Confirm Delete
                                        </button>
                                        <button 
                                            type="button"
                                            className="cancel-btn"
                                            onClick={cancelDelete}
                                            disabled={isSubmitting}
                                        >
                                            ✗ Cancel
                                        </button>
                                    </>
                                )}
                            </div>
                        </form>

                        {deleteConfirm && (
                            <div className="warning-message">
                                <strong>⚠️ Warning:</strong> This action cannot be undone. Are you sure you want to delete this post?
                            </div>
                        )}
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default EditPostPage;