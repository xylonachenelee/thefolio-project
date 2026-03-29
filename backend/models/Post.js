// backend/models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true, 
        trim: true 
    },
    content: { 
        type: String, 
        required: true 
    }, // Changed from 'body' to 'content' to match your frontend
    image: { 
        type: String, 
        default: '' // filename stored in uploads/ 
    },
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['published', 'removed'], 
        default: 'published' 
    }
}, { 
    timestamps: true // adds createdAt and updatedAt
});

module.exports = mongoose.model('Post', postSchema);