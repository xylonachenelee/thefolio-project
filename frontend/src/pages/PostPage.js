// frontend/src/pages/PostPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PostPage = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPostAndComments = async () => {
            try {
                const [postRes, commentsRes] = await Promise.all([
                    API.get(`/posts/${id}`),
                    API.get(`/posts/${id}/comments`)
                ]);
                setPost(postRes.data);
                setComments(commentsRes.data);
            } catch (err) {
                setError('Post not found or has been removed');
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPostAndComments();
    }, [id]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        
        setSubmitting(true);
        try {
            const response = await API.post(`/posts/${id}/comments`, {
                content: newComment
            });
            setComments([response.data, ...comments]);
            setNewComment('');
        } catch (err) {
            console.error('Error posting comment:', err);
            alert(err.response?.data?.message || 'Failed to post comment');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = () => {
        navigate(`/edit-post/${id}`);
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;
        
        try {
            await API.delete(`/comments/${commentId}`);
            setComments(comments.filter(c => c._id !== commentId));
        } catch (err) {
            console.error('Error deleting comment:', err);
            alert('Failed to delete comment');
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <section>
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

    if (error || !post) {
        return (
            <>
                <Navbar />
                <section>
                    <div className="car-container">
                        <div className="car error-state">
                            <h2>Oops!</h2>
                            <p>{error || 'Post not found'}</p>
                            <Link to="/home" className="btn">Go to Home</Link>
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
            <section className="post-page">
                <div className="car-container">
                    <div className="car">
                        {/* Post Header */}
                        <div className="post-header">
                            <h1>{post.title}</h1>
                            
                            {/* Author Info */}
                            <div className="author-info">
                                <img 
                                    src={post.author?.profilePic 
                                        ? `http://localhost:5000/uploads/${post.author.profilePic}`
                                        : 'https://via.placeholder.com/50'}
                                    alt={post.author?.name}
                                    className="author-avatar"
                                />
                                <div className="author-details">
                                    <p className="author-name">{post.author?.name}</p>
                                    <p className="post-date">
                                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                
                                {/* Edit button if user is author or admin */}
                                {user && (user._id === post.author?._id || user.role === 'admin') && (
                                    <button 
                                        onClick={handleEdit}
                                        className="edit-btn"
                                    >
                                        Edit Post
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Post Image */}
                        {post.image && (
                            <div className="post-image-container">
                                <img 
                                    src={`http://localhost:5000/uploads/${post.image}`}
                                    alt={post.title}
                                    className="post-image"
                                />
                            </div>
                        )}

                        {/* Post Content */}
                        <div className="post-content">
                            {post.content}
                        </div>

                        {/* Comments Section */}
                        <div className="comments-section">
                            <h3>Comments ({comments.length})</h3>

                            {/* Comment Form */}
                            {user ? (
                                <form onSubmit={handleCommentSubmit} className="comment-form">
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Write a comment..."
                                        rows="4"
                                        required
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={submitting}
                                        className="comment-submit-btn"
                                    >
                                        {submitting ? 'Posting...' : 'Post Comment'}
                                    </button>
                                </form>
                            ) : (
                                <p className="login-prompt">
                                    Please <Link to="/login">login</Link> to comment.
                                </p>
                            )}

                            {/* Comments List */}
                            <div className="comments-list">
                                {comments.length === 0 ? (
                                    <p className="no-comments">No comments yet. Be the first to comment!</p>
                                ) : (
                                    comments.map(comment => (
                                        <div key={comment._id} className="comment">
                                            <div className="comment-header">
                                                <img 
                                                    src={comment.author?.profilePic 
                                                        ? `http://localhost:5000/uploads/${comment.author.profilePic}`
                                                        : 'https://via.placeholder.com/30'}
                                                    alt={comment.author?.name}
                                                    className="comment-avatar"
                                                />
                                                <div className="comment-author-info">
                                                    <strong className="comment-author">{comment.author?.name}</strong>
                                                    <span className="comment-date">
                                                        {new Date(comment.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                
                                                {/* Delete comment button if user is author or admin */}
                                                {user && (user._id === comment.author?._id || user.role === 'admin') && (
                                                    <button 
                                                        onClick={() => handleDeleteComment(comment._id)}
                                                        className="delete-comment-btn"
                                                        title="Delete comment"
                                                    >
                                                        🗑️
                                                    </button>
                                                )}
                                            </div>
                                            <p className="comment-content">{comment.content}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Back to Home Button */}
                        <div className="back-to-home">
                            <Link to="/home" className="btn">
                                ← Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default PostPage;