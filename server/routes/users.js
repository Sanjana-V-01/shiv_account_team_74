const express = require('express');
const router = express.Router();
const { getAuth } = require('firebase-admin/auth');
const { db } = require('../index');

// Middleware to verify Firebase ID token
const verifyToken = async (req, res, next) => {
    const idToken = req.headers.authorization?.split('Bearer ')[1];
    if (!idToken) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const decodedToken = await getAuth().verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

// GET user details by UID
router.get('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    // Ensure the authenticated user is requesting their own data
    if (req.user.uid !== id) {
        return res.status(403).json({ message: 'Forbidden: You can only access your own user data.' });
    }

    try {
        const userRef = db.collection('users').doc(id);
        const doc = await userRef.get();
        if (!doc.exists) {
            return res.status(404).json({ message: 'User not found in Firestore' });
        }
        res.json(doc.data());
    } catch (error) {
        console.error("Error getting user data:", error);
        res.status(500).send("Error getting user data");
    }
});

module.exports = router;
