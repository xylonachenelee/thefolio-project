// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth.routes');
const postRoutes = require('./routes/post.routes');
const commentRoutes = require('./routes/comment.routes');
const adminRoutes = require('./routes/admin.routes');
const contactRoutes = require('./routes/contact.routes'); // ← ADD THIS

const app = express();

connectDB();

// ✅ IMPORTANT: Body parser MUST come before any route that uses req.body
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json()); // This parses JSON bodies
app.use(express.urlencoded({ extended: true })); // This parses form data

// Serve uploaded image files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log('📁 Serving static files from:', path.join(__dirname, 'uploads'));

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes); // ← ADD THIS

// ── Test Route ────────────────────────────────────────────────
app.get('/test', (req, res) => {
    res.json({ message: 'Cooking XCR Backend is working!' });
});

// ── 404 Handler ───────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// ── Error Handler ─────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error('🔥 Server Error:', err);
    res.status(500).json({ 
        message: 'Something went wrong!', 
        error: process.env.NODE_ENV === 'development' ? err.message : 'Server error'
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
    console.log(`📝 Test route: http://localhost:${PORT}/test`);
});