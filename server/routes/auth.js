const express = require('express');
const router = express.Router();
const { getAuth } = require('firebase-admin/auth');
const { db } = require('../firebase-config'); // Import Firestore instance

// --- REGISTRATION ENDPOINT ---
// POST /api/auth/register
router.post('/register', async (req, res) => {
    console.log('Auth Register Endpoint: Request received.');
    console.log('Request body:', req.body);
    const { name, loginId, email, password } = req.body;

    if (!name || !loginId || !email) {
        console.error('Auth Register Endpoint: Missing required fields.');
        return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    try {
        // Check if user already exists in Firebase Auth
        let userRecord;
        try {
            userRecord = await getAuth().getUserByEmail(email);
            console.log('Auth Register Endpoint: User already exists in Firebase Auth:', userRecord.uid);
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                // User doesn't exist, but we can't create them without password
                // This should not happen in normal flow since client creates user first
                console.error('Auth Register Endpoint: User not found in Firebase Auth, but no password provided to create user.');
                return res.status(400).json({ message: 'User not found in Firebase Auth. Please try signing up again.' });
            } else {
                throw error;
            }
        }

        // Save additional user info to Firestore
        const userRef = db.collection('users').doc(userRecord.uid);
        await userRef.set({
            name: name,
            loginId: loginId,
            email: email,
            role: 'Invoicing User'
        });
        console.log('Auth Register Endpoint: Firestore user document created for UID:', userRecord.uid);

        res.status(201).json({ message: 'User registered successfully.', uid: userRecord.uid });

    } catch (error) {
        console.error("Auth Register Endpoint: Error during user registration:", error);
        if (error.code === 'auth/email-already-exists') {
            return res.status(400).json({ message: 'Email already exists.' });
        }
        const errorMessage = error.message || 'An unknown error occurred during registration.';
        res.status(400).json({ message: `Registration failed: ${errorMessage}` });
    }
});

// NOTE: The login process is now handled by the client-side Firebase SDK.
// The client will receive an ID token upon successful login.
// That token can be sent to the server and verified with a middleware.

// Example of a token verification middleware (to be added to protected routes)
/*
const verifyToken = async (req, res, next) => {
    const idToken = req.headers.authorization?.split('Bearer ')[1];
    if (!idToken) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decodedToken = await getAuth().verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};
*/

module.exports = router;