const express = require('express');
const path = require('path');
const session = require('express-session');
const db = require('./database'); // <— make sure to import this
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // change to true if HTTPS enforced
  })
);

// ===========================
// STATIC FRONTEND HANDLER
// ===========================
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// Default route (login page)
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'login.html'));
});

// ===========================
// ROUTES
// ===========================
const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/files');
const userRoutes = require('./routes/users');

app.use('/api', authRoutes);
app.use('/api', fileRoutes);
app.use('/api', userRoutes);

// ===========================
// USER INFO + LOGOUT
// ===========================
app.get('/api/user-info', (req, res) => {
  if (!req.session.userId) return res.json({ success: false });

  db.getUserById(req.session.userId, (err, user) => {
    if (err || !user) return res.json({ success: false });
    res.json({ success: true, user: { name: user.name, email: user.email } });
  });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

// ===========================
// SERVER START
// ===========================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
