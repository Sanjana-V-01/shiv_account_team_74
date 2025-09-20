const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const dbPath = path.join(__dirname, '..', 'db', 'contacts.json');

// Set up multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/profile_images');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Function to read contacts from the database
const readContacts = () => {
    const data = fs.readFileSync(dbPath);
    return JSON.parse(data);
};

// Function to write contacts to the database
const writeContacts = (contacts) => {
    fs.writeFileSync(dbPath, JSON.stringify(contacts, null, 2));
};

// GET all contacts
router.get('/', (req, res) => {
    const contacts = readContacts();
    res.json(contacts);
});

// POST a new contact with optional image upload
router.post('/', upload.single('profileImage'), (req, res) => {
    const contacts = readContacts();
    const newContact = {
        id: contacts.length > 0 ? contacts[contacts.length - 1].id + 1 : 1,
        ...req.body,
        profileImage: req.file ? `/uploads/profile_images/${req.file.filename}` : null
    };
    contacts.push(newContact);
    writeContacts(contacts);
    res.status(201).json(newContact);
});

// GET a single contact by ID
router.get('/:id', (req, res) => {
    const contacts = readContacts();
    const contact = contacts.find(c => c.id === parseInt(req.params.id));
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.json(contact);
});

// PUT (update) a contact by ID with optional image upload
router.put('/:id', upload.single('profileImage'), (req, res) => {
    let contacts = readContacts();
    const index = contacts.findIndex(c => c.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: 'Contact not found' });

    const updatedContact = { ...contacts[index], ...req.body };
    
    // If a new file is uploaded, update the profileImage field
    if (req.file) {
        // Optionally, delete the old image file if it exists
        if (contacts[index].profileImage) {
            const oldImagePath = path.join(__dirname, '..', contacts[index].profileImage);
            fs.unlink(oldImagePath, (err) => {
                if (err) console.error("Error deleting old image:", err);
            });
        }
        updatedContact.profileImage = `/uploads/profile_images/${req.file.filename}`;
    } else if (req.body.profileImage === 'null') { // Handle case where image is explicitly removed
        if (contacts[index].profileImage) {
            const oldImagePath = path.join(__dirname, '..', contacts[index].profileImage);
            fs.unlink(oldImagePath, (err) => {
                if (err) console.error("Error deleting old image:", err);
            });
        }
        updatedContact.profileImage = null;
    }

    contacts[index] = updatedContact;
    writeContacts(contacts);
    res.json(updatedContact);
});

// DELETE a contact by ID
router.delete('/:id', (req, res) => {
    let contacts = readContacts();
    const contactToDelete = contacts.find(c => c.id === parseInt(req.params.id));
    if (!contactToDelete) {
        return res.status(404).json({ message: 'Contact not found' });
    }

    // Optionally, delete the associated image file
    if (contactToDelete.profileImage) {
        const imagePath = path.join(__dirname, '..', contactToDelete.profileImage);
        fs.unlink(imagePath, (err) => {
            if (err) console.error("Error deleting image file:", err);
        });
    }

    const filteredContacts = contacts.filter(c => c.id !== parseInt(req.params.id));
    writeContacts(filteredContacts);
    res.status(204).send(); // No Content
});

module.exports = router;