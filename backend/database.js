// ============================================
// DATABASE CONNECTION AND QUERY HELPERS (PostgreSQL)
// ============================================
const { Pool } = require('pg');

// Create a connection pool using environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://codcentral_db_user:mgI57sqlxZOCoZh25xoleWCKuBX5gMbF@dpg-d4976e2li9vc739mru60-a.oregon-postgres.render.com/codcentral_db',
  ssl: { rejectUnauthorized: false }
});


// ============================================
// TEST DATABASE CONNECTION
// ============================================
pool.connect()
    .then(() => console.log('✅ POSTGRES DATABASE CONNECTED SUCCESSFULLY!'))
    .catch(err => console.error('❌ DATABASE CONNECTION FAILED:', err));

// ============================================
// HELPER FUNCTION: Execute Query
// ============================================
function query(text, params, callback) {
    pool.query(text, params)
        .then(res => callback(null, res.rows))
        .catch(err => {
            console.log('🔴 QUERY ERROR:', err.message);
            console.log('   Query:', text);
            console.log('   Parameters:', params);
            callback(err, null);
        });
}

// ============================================
// USER FUNCTIONS
// ============================================
function getUserByEmail(email, callback) {
    query('SELECT * FROM users WHERE email = $1', [email], callbackWrapper(callback));
}

function getUserById(id, callback) {
    query('SELECT * FROM users WHERE id = $1', [id], callbackWrapper(callback));
}

function createUser(name, email, password, callback) {
    query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id',
        [name, email, password],
        (err, results) => {
            if (err) return callback(err, null);
            callback(null, results[0].id);
        }
    );
}

function updateUser(id, name, email, password, callback) {
    query(
        'UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4',
        [name, email, password, id],
        callback
    );
}

function deleteUser(id, callback) {
    query('DELETE FROM users WHERE id = $1', [id], callback);
}

// ============================================
// FILE FUNCTIONS
// ============================================
function getFilesByUserId(userId, callback) {
    query('SELECT * FROM files WHERE user_id = $1 ORDER BY uploaded_at DESC', [userId], callback);
}

function getFileById(fileId, userId, callback) {
    query('SELECT * FROM files WHERE id = $1 AND user_id = $2', [fileId, userId], callbackWrapper(callback));
}

function saveFile(userId, fileName, filePath, callback) {
    query(
        'INSERT INTO files (user_id, name, path) VALUES ($1, $2, $3) RETURNING id',
        [userId, fileName, filePath],
        (err, results) => {
            if (err) return callback(err, null);
            callback(null, results[0].id);
        }
    );
}

function deleteFile(fileId, userId, callback) {
    query('DELETE FROM files WHERE id = $1 AND user_id = $2', [fileId, userId], callback);
}

function getAllFiles(callback) {
    query('SELECT * FROM files ORDER BY uploaded_at DESC', [], callback);
}

// ============================================
// HELPER: wrap result for single-row queries
// ============================================
function callbackWrapper(cb) {
    return (err, results) => {
        if (err) return cb(err, null);
        if (results.length > 0) cb(null, results[0]);
        else cb(null, null);
    };
}

// ============================================
// EXPORT ALL FUNCTIONS
// ============================================
module.exports = {
    query,
    getUserByEmail,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getFilesByUserId,
    getFileById,
    saveFile,
    deleteFile,
    getAllFiles
};
