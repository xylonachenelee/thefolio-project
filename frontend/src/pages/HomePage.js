// frontend/src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API from '../api/axios';

function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get('/posts')
            .then(res => {
                setPosts(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching posts:', err);
                setLoading(false);
            });
    }, []);

    return (
        <>
            <Navbar />
            <section>
                {/* Phase 1 Content */}
                <div className="car-container">
                    <div className="car">
                        <div className="hero-text">
                            <p>
                                This website is a personal portfolio created to showcase my passion for cooking.
                                It highlights my interest in preparing meals, exploring flavors, and continuously
                                improving my skills in the kitchen. Cooking is more than just making food. It is a creative process that allows me
                                to express care, patience, and dedication. Through this website, I want to share
                                my journey, the dishes I enjoy making, and the inspiration behind them.
                            </p>

                            <ul>
                                <li>Cooking meals that feels like home.</li>
                                <li>Discovering new taste and new recipe.</li>
                                <li>Always learning, always experimenting.</li>
                                <li>Inspired by culture, comfort and creativity.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="car-container">
                    <div className="car">
                        <img src="/food1.jpg" alt="mixed food" />
                    </div>
                </div>

                <div className="car-container">
                    <div className="car">
                        <h2>Dishes I Love to Create</h2>
                        <p>
                            These are some of the types of dishes I enjoy preparing the most. Each dish reflects
                            my appreciation for balance, flavor, and comfort.
                        </p>

                        <div className="card-container">
                            <div className="card">
                                <img src="/rice.jpg" alt="comfort rice meals" />
                                <h3>Comfort Rice Meals</h3>
                                <p>
                                    Warm and filling meals inspired by everyday home cooking.
                                </p>
                            </div>

                            <div className="card">
                                <img src="/chicken.jpg" alt="chicken favorites" />
                                <h3>Chicken Favorites</h3>
                                <p>
                                    Flavorful chicken dishes that are simple, satisfying, and enjoyable.
                                </p>
                            </div>

                            <div className="card">
                                <img src="/pasta.jpg" alt="Pastas" />
                                <h3>Pasta Vibes</h3>
                                <p>
                                    Delicious pasta and warmth on every plate.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="car-container">
                    <div className="car">
                        <h2>More About Us</h2>
                        <div className="card-container">
                            <div className="card">
                                <h2>About My Cooking Journey</h2>
                                <p>
                                    Every cook has a story. On the About page, you can learn how my interest in cooking
                                    started, how I developed my skills, and what motivates me to continue learning
                                    in the kitchen.
                                </p>
                                <a href="/about">
                                    <button>Learn More About Me</button>
                                </a>
                            </div>

                            <div className="card">
                                <h2>Get in Touch</h2>
                                <p>
                                    If you would like to share cooking ideas, explore resources, or leave feedback,
                                    you can visit the Contact page and send a message.
                                </p>
                                <a href="/contact">
                                    <button>Go to Contact Page</button>
                                </a>
                            </div>

                            <div className="card">
                                <h2>Join My Cooking Updates</h2>
                                <p>
                                    Interested in following my cooking journey? You can sign up to receive updates
                                    about new dishes, experiences, and food-related content.
                                </p>
                                <a href="/register">
                                    <button>Register Here</button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Phase 2 Posts Section */}
                <div className="car-container">
                    <div className="car">
                        <h2>📝 Latest Community Posts</h2>
                        <p>Check out what other cooking enthusiasts are sharing!</p>
                        
                        {loading ? (
                            <div className="loading-container">
                                <div className="spinner"></div>
                                <p>Loading posts...</p>
                            </div>
                        ) : (
                            <>
                                {posts.length === 0 ? (
                                    <p className="no-posts-message">
                                        No posts yet. Be the first to share your cooking experience!
                                    </p>
                                ) : (
                                    <div className="posts-grid">
                                        {posts.map(post => (
                                            <div key={post._id} className="post-card">
                                                {post.image && (
                                                    <img 
                                                        src={`http://localhost:5000/uploads/${post.image}`}
                                                        alt={post.title}
                                                        className="post-image"
                                                    />
                                                )}
                                                <div className="post-content">
                                                    <h3 className="post-title">
                                                        <Link to={`/post/${post._id}`} className="post-link">
                                                            {post.title}
                                                        </Link>
                                                    </h3>
                                                    <p className="post-excerpt">
                                                        {post.content.substring(0, 120)}...
                                                    </p>
                                                    <small className="post-meta">
                                                        By {post.author?.name || 'Unknown'} · {new Date(post.createdAt).toLocaleDateString()}
                                                    </small>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}

export default Home;