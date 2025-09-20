const express = require('express');
const router = express.Router();
const { db } = require('../index');

// Generic GET all
const getAll = async (req, res) => {
    try {
        const snapshot = await db.collection('accounts').get();
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(items);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Generic POST
const createOne = async (req, res) => {
    try {
        const newItem = req.body;
        const docRef = await db.collection('accounts').add(newItem);
        res.status(201).json({ id: docRef.id, ...newItem });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Generic PUT
const updateOne = async (req, res) => {
    try {
        const { id } = req.params;
        await db.collection('accounts').doc(id).update(req.body);
        res.json({ id, ...req.body });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Generic DELETE
const deleteOne = async (req, res) => {
    try {
        const { id } = req.params;
        await db.collection('accounts').doc(id).delete();
        res.status(204).send();
    } catch (error) {
        res.status(500).send(error.message);
    }
};

router.get('/', getAll);
router.post('/', createOne);
router.put('/:id', updateOne);
router.delete('/:id', deleteOne);

module.exports = router;