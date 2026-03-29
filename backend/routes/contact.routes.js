const express = require('express');
const Message = require('../models/Message');
const router = express.Router();

// POST /api/contact — Save contact message
router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        const newMessage = await Message.create({
            name,
            email,
            subject: subject || 'General Inquiry',
            message,
            status: 'unread'
        });
        
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (err) {
        console.error('Error saving message:', err);
        res.status(500).json({ message: 'Failed to send message' });
    }
});

module.exports = router;