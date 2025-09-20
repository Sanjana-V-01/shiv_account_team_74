const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'db', 'users.json');
const JWT_SECRET = 'your-super-secret-key-for-hackathon'; // In a real app, use environment variables

// Function to read users from the database
const readUsers = () => {
    const data = fs.readFileSync(dbPath);
    return JSON.parse(data);
};

// Function to write users to the database
const writeUsers = (users) => {
    fs.writeFileSync(dbPath, JSON.stringify(users, null, 2));
};

// --- REGISTRATION ENDPOINT ---
// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { name, loginId, email, password } = req.body;

    if (!name || !loginId || !email || !password) {
        return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    const users = readUsers();

    // Check for uniqueness
    if (users.some(user => user.loginId === loginId)) {
        return res.status(400).json({ message: 'Login ID already exists.' });
    }
    if (users.some(user => user.email === email)) {
        return res.status(400).json({ message: 'Email already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
        id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
        name,
        loginId,
        email,
        password: hashedPassword,
        role: 'Invoicing User' // Default role
    };

    users.push(newUser);
    writeUsers(users);

    res.status(201).json({ message: 'User registered successfully.' });
});

// --- LOGIN ENDPOINT ---
// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { loginId, password } = req.body;

    if (!loginId || !password) {
        return res.status(400).json({ message: 'Please provide loginId and password.' });
    }

    const users = readUsers();
    const user = users.find(u => u.loginId === loginId);

    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Create JWT Token
    const payload = {
        user: {
            id: user.id,
            name: user.name,
            role: user.role
        }
    };

    jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
        if (err) throw err;
        res.json({ token });
    });
});


module.exports = router;
