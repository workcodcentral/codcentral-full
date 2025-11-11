const express = require('express');
const router = express.Router();
const db = require('../database');

// LOGIN ROUTE
router.post('/login', (req, res) => {
    const { userId, email, password } = req.body;

    db.getUserByEmail(email, (err, user) => {
        if (err) {
            return res.json({ success: false, message: 'Database error' });
        }
        if (!user) {
            return res.json({ success: false, message: 'Email not found' });
        }
        if (user.password !== password) {
            return res.json({ success: false, message: 'Password incorrect' });
        }

        // Login successful
        req.session.userId = user.id;
        res.json({ success: true, message: 'Login successful' });
    });
});

// SIGNUP ROUTE
router.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    console.log('Signup attempt:', { name, email });

    db.getUserByEmail(email, (err, user) => {
        if (err) {
            return res.json({ success: false, message: 'Database error' });
        }
        if (user) {
            return res.json({ success: false, message: 'Email already exists' });
        }

        db.createUser(name, email, password, (err, userId) => {
            if (err) {
                console.log('Signup - Create user error:', err);
                return res.json({
                    success: false,
                    message: 'Could not create user: ' + (err.message || 'Database error')
                });
            }
            console.log('Signup - User created successfully, ID:', userId);
            res.json({
                success: true,
                message: 'User created successfully!',
                userId: userId
            });
        });
    });
});

module.exports = router;
