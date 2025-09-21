const express = require('express');
const router = express.Router();
const { getAuth } = require('firebase-admin/auth');
const { db } = require('../firebase-config');

// Middleware to verify Firebase ID token
const verifyToken = async (req, res, next) => {
    const idToken = req.headers.authorization?.split('Bearer ')[1];
    console.log('verifyToken: Received request for token verification.');
    if (!idToken) {
        console.log('verifyToken: No token provided.');
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        console.log('verifyToken: Attempting to verify ID token...');
        const decodedToken = await getAuth().verifyIdToken(idToken);
        req.user = decodedToken;
        console.log('verifyToken: Token successfully verified for user:', decodedToken.uid);
        next();
    } catch (error) {
        console.error('verifyToken: Error verifying token:', error);
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

// GET user details by UID
router.get('/:id', verifyToken, async (req, res) => {
    console.log('GET /:id route: Entered route handler.');
    const { id } = req.params;
    console.log('GET /:id route: Requested user ID:', id);

    // Ensure the authenticated user is requesting their own data
    if (req.user.uid !== id) {
        console.log('GET /:id route: Forbidden - User ID mismatch.');
        return res.status(403).json({ message: 'Forbidden: You can only access your own user data.' });
    }

    try {
        console.log('GET /:id route: Attempting to fetch user from Firestore for ID:', id);
        const userRef = db.collection('users').doc(id);
        const doc = await userRef.get();
        if (!doc.exists) {
            console.log('GET /:id route: User not found in Firestore for ID:', id);
            return res.status(404).json({ message: 'User not found in Firestore' });
        }
        console.log('GET /:id route: User data found for ID:', id);
        res.json(doc.data());
    } catch (error) {
        console.error("GET /:id route: Error getting user data:", error);
        res.status(500).send("Error getting user data");
    }
});

module.exports = router;
