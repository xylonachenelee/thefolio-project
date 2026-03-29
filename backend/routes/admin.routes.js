// backend/routes/admin.routes.js
const express = require('express');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Message = require('../models/Message'); // ← ADD THIS
const { protect } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/role.middleware');
const router = express.Router();

// All routes below require: (1) valid token AND (2) admin role
router.use(protect, adminOnly);

// ==================== USER MANAGEMENT ====================

// GET /api/admin/users — List all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 });
        res.json(users);
    } catch (err) { 
        console.error('Error fetching users:', err);
        res.status(500).json({ message: err.message }); 
    }
});

// PUT /api/admin/users/:id/status — Toggle user active/inactive
router.put('/users/:id/status', async (req, res) => {
    console.log('🔄 Backend: Toggling status for user:', req.params.id);
    console.log('Admin user:', req.user._id, req.user.role);
    
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            console.log('❌ User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('✅ User found:', user.email, 'Current status:', user.status);

        // Prevent deactivating other admins
        if (user.role === 'admin' && req.user._id.toString() !== user._id.toString()) {
            console.log('❌ Cannot modify another admin');
            return res.status(403).json({ message: 'Cannot modify another admin' });
        }

        // Toggle status
        user.status = user.status === 'active' ? 'inactive' : 'active';
        await user.save();

        console.log('✅ Status updated to:', user.status);

        // Return updated user without password
        const updatedUser = await User.findById(user._id).select('-password');
        
        res.json({ 
            message: `User is now ${user.status}`,
            user: updatedUser 
        });
    } catch (err) { 
        console.error('❌ Error updating status:', err);
        res.status(500).json({ message: err.message }); 
    }
});

// ==================== POST MODERATION ====================

// GET /api/admin/posts — List ALL posts including removed ones
router.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'name email profilePic')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) { 
        console.error('Error fetching posts:', err);
        res.status(500).json({ message: err.message }); 
    }
});

// PUT /api/admin/posts/:id/remove — Mark post as removed
router.put('/posts/:id/remove', async (req, res) => {
    console.log('🚫 Backend: Removing post:', req.params.id);
    
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            console.log('❌ Post not found');
            return res.status(404).json({ message: 'Post not found' });
        }

        console.log('✅ Post found:', post.title, 'Current status:', post.status);

        post.status = 'removed';
        await post.save();

        console.log('✅ Post status updated to:', post.status);

        const updatedPost = await Post.findById(post._id)
            .populate('author', 'name email profilePic');

        res.json({ 
            message: 'Post has been removed',
            post: updatedPost 
        });
    } catch (err) { 
        console.error('❌ Error removing post:', err);
        res.status(500).json({ message: err.message }); 
    }
});

// PUT /api/admin/posts/:id/restore — Restore removed post
router.put('/posts/:id/restore', async (req, res) => {
    console.log('🔄 Backend: Restoring post:', req.params.id);
    
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            console.log('❌ Post not found');
            return res.status(404).json({ message: 'Post not found' });
        }

        console.log('✅ Post found:', post.title, 'Current status:', post.status);

        post.status = 'published';
        await post.save();

        console.log('✅ Post status updated to:', post.status);

        const updatedPost = await Post.findById(post._id)
            .populate('author', 'name email profilePic');

        res.json({ 
            message: 'Post has been restored',
            post: updatedPost 
        });
    } catch (err) { 
        console.error('❌ Error restoring post:', err);
        res.status(500).json({ message: err.message }); 
    }
});

// DELETE /api/admin/posts/:id — Permanently delete a post
router.delete('/posts/:id', async (req, res) => {
    console.log('🗑️ Backend: Permanently deleting post:', req.params.id);
    
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            console.log('❌ Post not found');
            return res.status(404).json({ message: 'Post not found' });
        }

        console.log('✅ Post found:', post.title);

        // Delete all comments associated with this post first
        await Comment.deleteMany({ post: req.params.id });
        console.log(`✅ Deleted all comments for post ${req.params.id}`);
        
        // Then delete the post
        await Post.findByIdAndDelete(req.params.id);

        console.log(`✅ Post "${post.title}" permanently deleted`);
        res.json({ message: 'Post permanently deleted' });
    } catch (err) { 
        console.error('❌ Error deleting post:', err);
        res.status(500).json({ message: err.message }); 
    }
});

// ==================== MESSAGE MANAGEMENT (NEW) ====================

// GET /api/admin/messages — Get all contact messages
router.get('/messages', async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (err) {
        console.error('Error fetching messages:', err);
        res.status(500).json({ message: err.message });
    }
});

// PUT /api/admin/messages/:id/read — Mark message as read
router.put('/messages/:id/read', async (req, res) => {
    console.log('📖 Backend: Marking message as read:', req.params.id);
    
    try {
        const message = await Message.findById(req.params.id);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }
        
        message.status = 'read';
        await message.save();
        
        console.log('✅ Message marked as read');
        res.json({ message: 'Message marked as read' });
    } catch (err) {
        console.error('❌ Error marking message as read:', err);
        res.status(500).json({ message: err.message });
    }
});

// DELETE /api/admin/messages/:id — Delete a message
router.delete('/messages/:id', async (req, res) => {
    console.log('🗑️ Backend: Deleting message:', req.params.id);
    
    try {
        const message = await Message.findByIdAndDelete(req.params.id);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }
        
        console.log('✅ Message deleted successfully');
        res.json({ message: 'Message deleted successfully' });
    } catch (err) {
        console.error('❌ Error deleting message:', err);
        res.status(500).json({ message: err.message });
    }
});

// ==================== DASHBOARD STATS ====================

// GET /api/admin/stats — Dashboard summary stats
router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ status: 'active' });
        const totalPosts = await Post.countDocuments();
        const publishedPosts = await Post.countDocuments({ status: 'published' });
        const removedPosts = await Post.countDocuments({ status: 'removed' });
        const unreadMessages = await Message.countDocuments({ status: 'unread' });
        const totalMessages = await Message.countDocuments();

        res.json({
            totalUsers,
            activeUsers,
            totalPosts,
            publishedPosts,
            removedPosts,
            unreadMessages,
            totalMessages
        });
    } catch (err) {
        console.error('Error fetching stats:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;