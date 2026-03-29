// backend/routes/post.routes.js
const express = require('express');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { protect } = require('../middleware/auth.middleware');
const { userOrAdmin } = require('../middleware/role.middleware');
const upload = require('../middleware/upload');

const router = express.Router(); // ← THIS WAS MISSING!

// GET /api/posts — Public: all published posts (newest first)
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find({ status: 'published' })
            .populate('author', 'name profilePic')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) { 
        res.status(500).json({ message: err.message }); 
    }
});

// GET /api/posts/:id — Public: single post by ID
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'name profilePic');
        
        if (!post || post.status === 'removed') {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        res.json(post);
    } catch (err) { 
        res.status(500).json({ message: err.message }); 
    }
});

// POST /api/posts — Create new post
router.post('/', protect, userOrAdmin, upload.single('image'), async (req, res) => {
    try {
        const { title, content } = req.body;
        const image = req.file ? req.file.filename : '';
        
        const post = await Post.create({ 
            title, 
            content,
            image, 
            author: req.user._id 
        });
        
        await post.populate('author', 'name profilePic');
        res.status(201).json(post);
    } catch (err) { 
        res.status(500).json({ message: err.message }); 
    }
});

// PUT /api/posts/:id — Edit post
router.put('/:id', protect, userOrAdmin, upload.single('image'), async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const isOwner = post.author.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Update fields
        if (req.body.title) post.title = req.body.title;
        if (req.body.content) post.content = req.body.content;
        if (req.file) {
            console.log('📸 New image uploaded:', req.file.filename);
            post.image = req.file.filename;
        }
        
        post.updatedAt = Date.now();
        await post.save();
        
        const updatedPost = await Post.findById(post._id)
            .populate('author', 'name profilePic');
        
        res.json(updatedPost);
    } catch (err) { 
        console.error('❌ Error updating post:', err);
        res.status(500).json({ message: err.message }); 
    }
});

// DELETE /api/posts/:id — Delete post
router.delete('/:id', protect, userOrAdmin, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const isOwner = post.author.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Delete associated comments first
        await Comment.deleteMany({ post: req.params.id });
        
        // Then delete the post
        await post.deleteOne();
        
        res.json({ message: 'Post deleted successfully' });
    } catch (err) { 
        res.status(500).json({ message: err.message }); 
    }
});

// GET /api/posts/:id/comments — Get all comments for a post
router.get('/:id/comments', async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.id })
            .populate('author', 'name profilePic')
            .sort({ createdAt: -1 });
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/posts/:id/comments — Add a comment to a post
router.post('/:id/comments', protect, userOrAdmin, async (req, res) => {
    try {
        const { content } = req.body;
        
        const comment = await Comment.create({
            content,
            author: req.user._id,
            post: req.params.id
        });
        
        const populatedComment = await Comment.findById(comment._id)
            .populate('author', 'name profilePic');
        
        res.status(201).json(populatedComment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;