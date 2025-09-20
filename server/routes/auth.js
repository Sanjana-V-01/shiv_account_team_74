const express = require('express');
const router = express.Router();
const { getAuth } = require('firebase-admin/auth');
const { db } = require('../index'); // Import Firestore instance

// --- REGISTRATION ENDPOINT ---
// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { name, loginId, email, password } = req.body;

    if (!name || !loginId || !email || !password) {
        return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    try {
        // Create user in Firebase Authentication
        const userRecord = await getAuth().createUser({
            email: email,
            password: password,
            displayName: name,
        });

        // Save additional user details in Firestore
        const userRef = db.collection('users').doc(userRecord.uid);
        await userRef.set({
            name: name,
            loginId: loginId,
            email: email,
            role: 'Invoicing User' // Default role
        });

        res.status(201).json({ message: 'User registered successfully.', uid: userRecord.uid });

    } catch (error) {
        console.error("Error creating new user:", error);
        if (error.code === 'auth/email-already-exists') {
            return res.status(400).json({ message: 'Email already exists.' });
        }
        res.status(500).json({ message: 'Error creating new user.' });
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