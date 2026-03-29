// backend/middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');
console.log('📁 Upload directory:', uploadDir);

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('✅ Created uploads directory');
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('📸 Saving file to:', uploadDir);
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const filename = unique + path.extname(file.originalname);
        console.log('📝 Generated filename:', filename);
        cb(null, filename);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mime = allowedTypes.test(file.mimetype);
    
    if (ext && mime) return cb(null, true);
    cb(new Error('Only image files are allowed (jpg, png, gif, webp)'));
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;