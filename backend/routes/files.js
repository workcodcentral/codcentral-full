const express = require('express');
const router = express.Router();
const db = require('../database');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// GET all files for a user
router.get('/files', (req, res) => {
    const userId = req.session?.userId;
    if (!userId) return res.json({ success: false, message: 'Not logged in' });

    console.log('Fetching files for user:', userId);

    db.getFilesByUserId(userId, (err, files) => {
        if (err) {
            console.log('Error fetching files:', err);
            return res.json({ success: false, message: 'Database error' });
        }
        console.log('Files found:', files);
        res.json({ success: true, files });
    });
});

// UPLOAD file
router.post('/upload', upload.single('file'), (req, res) => {
    const userId = req.session?.userId;
    if (!userId) return res.json({ success: false, message: 'Not logged in' });
    if (!req.file) return res.json({ success: false, message: 'No file selected' });

    console.log('File details:', req.file);

    db.saveFile(userId, req.file.originalname, req.file.path, (err, fileId) => {
        if (err) {
            console.log('Database save error:', err);
            return res.json({ success: false, message: 'Could not save file to database' });
        }
        console.log('File saved with ID:', fileId);
        res.json({ success: true, message: 'File uploaded successfully!' });
    });
});

// DOWNLOAD file
router.get('/download/:id', (req, res) => {
    const userId = req.session?.userId;
    if (!userId) return res.json({ success: false, message: 'Not logged in' });

    const fileId = req.params.id;
    console.log('Download request - File ID:', fileId, 'User ID:', userId);

    db.getFileById(fileId, userId, (err, file) => {
        if (err || !file) {
            console.log('File not found error:', err);
            return res.json({ success: false, message: 'File not found' });
        }

        console.log('Sending file for download:', file.path);
        res.download(file.path, file.name);
    });
});

module.exports = router;
