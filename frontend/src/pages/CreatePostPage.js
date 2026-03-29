// frontend/src/pages/CreatePostPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CreatePostPage = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState(''); // Changed from 'body' to 'content'
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log('📸 Image selected:', file.name, file.type, file.size);
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

        // Create FormData
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content); // Make sure this matches backend field name
        if (image) {
            formData.append('image', image); // This must match the field name in upload.single('image')
            console.log('📤 Appending image to FormData:', image.name);
        }

        // Log FormData contents for debugging
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + (pair[0] === 'image' ? 'File: ' + pair[1].name : pair[1]));
        }

        try {
            const response = await API.post('/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('✅ Post created:', response.data);
            navigate(`/post/${response.data._id}`);
        } catch (err) { 
            console.error('❌ Error creating post:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Failed to publish post');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Navbar />
            <section className="create-post-page">
                <div className="car-container">
                    <div className="car" style={{ maxWidth: '800px' }}>
                        <h2>Write a New Post</h2>
                        <p style={{ textIndent: 0, marginBottom: '20px' }}>
                            Share your cooking experience, recipe, or food story with the community{user?.name ? `, ${user.name}` : ''}!
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

                            <div className="form-group">
                                <label htmlFor="image">Cover Image (Optional):</label>
                                <input
                                    type="file"
                                    id="image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    disabled={isSubmitting}
                                />
                                <small style={{ color: '#999', display: 'block', marginTop: '5px' }}>
                                    Upload an image to make your post more appealing (JPG, PNG, GIF) - Max 5MB
                                </small>
                                
                                {imagePreview && (
                                    <div style={{ marginTop: '15px' }}>
                                        <p style={{ textIndent: 0, marginBottom: '10px' }}>Preview:</p>
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

                            <div style={{
                                backgroundColor: '#f8f9fa',
                                padding: '15px',
                                borderRadius: '10px',
                                marginBottom: '20px',
                                border: '1px solid #e0e0e0'
                            }}>
                                <p style={{ textIndent: 0, marginBottom: '5px', color: '#3a7d44' }}>
                                    <strong>✍️ Tips for a great post:</strong>
                                </p>
                                <ul style={{ marginLeft: '20px', color: '#666' }}>
                                    <li>Use a descriptive title</li>
                                    <li>Include ingredients and steps for recipes</li>
                                    <li>Share personal experiences or tips</li>
                                    <li>Add a mouth-watering cover image</li>
                                </ul>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                style={{ 
                                    width: '100%',
                                    opacity: isSubmitting ? 0.7 : 1
                                }}
                            >
                                {isSubmitting ? 'Publishing...' : '📝 Publish Post'}
                            </button>
                        </form>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default CreatePostPage;