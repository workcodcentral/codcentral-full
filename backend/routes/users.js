const express = require('express');
const router = express.Router();
const db = require('../database');

// GET USER INFO
router.get('/user-info', (req, res) => {
    if (!req.session || !req.session.userId) {
        return res.json({ success: false, message: 'Not logged in' });
    }

    const userId = req.session.userId;

    db.getUserById(userId, (err, user) => {
        if (err) {
            console.log('Error fetching user:', err);
            return res.json({ success: false, message: 'Database error' });
        }
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, user: user });
    });
});

module.exports = router;
