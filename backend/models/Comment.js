// backend/models/Comment.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    post: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Post', 
        required: true 
    },
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    content: { 
        type: String, 
        required: true, 
        trim: true 
    } // Changed from 'body' to 'content' to match your frontend
}, { 
    timestamps: true // adds createdAt and updatedAt
});

module.exports = mongoose.model('Comment', commentSchema);