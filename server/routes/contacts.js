const express = require('express');
const router = express.Router();
const { db } = require('../index'); // Import Firestore instance
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// --- Multer Setup for File Uploads ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/profile_images');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// --- API Routes ---

// GET all contacts
router.get('/', async (req, res) => {
    try {
        const contactsRef = db.collection('contacts');
        const snapshot = await contactsRef.get();
        if (snapshot.empty) {
            return res.json([]);
        }
        const contacts = [];
        snapshot.forEach(doc => {
            contacts.push({ id: doc.id, ...doc.data() });
        });
        res.json(contacts);
    } catch (error) {
        console.error("Error getting contacts: ", error);
        res.status(500).send("Error getting contacts");
    }
});

// POST a new contact
router.post('/', upload.single('profileImage'), async (req, res) => {
    try {
        const newContactData = {
            ...req.body,
            profileImage: req.file ? `/uploads/profile_images/${req.file.filename}` : null
        };
        const docRef = await db.collection('contacts').add(newContactData);
        res.status(201).json({ id: docRef.id, ...newContactData });
    } catch (error) {
        console.error("Error adding contact: ", error);
        res.status(500).send("Error adding contact");
    }
});

// GET a single contact by ID
router.get('/:id', async (req, res) => {
    try {
        const contactId = req.params.id;
        const contactRef = db.collection('contacts').doc(contactId);
        const doc = await contactRef.get();
        if (!doc.exists) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.json({ id: doc.id, ...doc.data() });
    } catch (error) {
        console.error("Error getting contact: ", error);
        res.status(500).send("Error getting contact");
    }
});

// PUT (update) a contact by ID
router.put('/:id', upload.single('profileImage'), async (req, res) => {
    try {
        const contactId = req.params.id;
        const contactRef = db.collection('contacts').doc(contactId);
        const doc = await contactRef.get();
        if (!doc.exists) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        const updatedData = { ...req.body };
        const oldData = doc.data();

        // Handle file upload
        if (req.file) {
            // Delete old image if it exists
            if (oldData.profileImage) {
                const oldImagePath = path.join(__dirname, '..', oldData.profileImage);
                fs.unlink(oldImagePath, (err) => {
                    if (err) console.error("Error deleting old image:", err);
                });
            }
            updatedData.profileImage = `/uploads/profile_images/${req.file.filename}`;
        } else if (req.body.profileImage === 'null') {
             // Handle case where image is explicitly removed
            if (oldData.profileImage) {
                const oldImagePath = path.join(__dirname, '..', oldData.profileImage);
                fs.unlink(oldImagePath, (err) => {
                    if (err) console.error("Error deleting old image:", err);
                });
            }
            updatedData.profileImage = null;
        }

        await contactRef.update(updatedData);
        res.json({ id: contactId, ...updatedData });

    } catch (error) {
        console.error("Error updating contact: ", error);
        res.status(500).send("Error updating contact");
    }
});

// DELETE a contact by ID
router.delete('/:id', async (req, res) => {
    try {
        const contactId = req.params.id;
        const contactRef = db.collection('contacts').doc(contactId);
        const doc = await contactRef.get();
        if (!doc.exists) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        const contactToDelete = doc.data();

        // Delete the associated image file
        if (contactToDelete.profileImage) {
            const imagePath = path.join(__dirname, '..', contactToDelete.profileImage);
            fs.unlink(imagePath, (err) => {
                if (err) console.error("Error deleting image file:", err);
            });
        }

        await contactRef.delete();
        res.status(204).send(); // No Content
    } catch (error) {
        console.error("Error deleting contact: ", error);
        res.status(500).send("Error deleting contact");
    }
});

module.exports = router;
