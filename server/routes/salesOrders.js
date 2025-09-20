const express = require('express');
const router = express.Router();
const { db } = require('../index'); // Import Firestore instance

// GET all sales orders
router.get('/', async (req, res) => {
    try {
        const soRef = db.collection('salesOrders');
        const snapshot = await soRef.get();
        if (snapshot.empty) {
            return res.json([]);
        }
        const salesOrders = [];
        snapshot.forEach(doc => {
            salesOrders.push({ id: doc.id, ...doc.data() });
        });
        res.json(salesOrders);
    } catch (error) {
        console.error("Error getting sales orders: ", error);
        res.status(500).send("Error getting sales orders");
    }
});

// POST a new sales order
router.post('/', async (req, res) => {
    try {
        const newSalesOrder = {
            status: 'Draft', // Default status
            ...req.body
        };
        const docRef = await db.collection('salesOrders').add(newSalesOrder);
        res.status(201).json({ id: docRef.id, ...newSalesOrder });
    } catch (error) {
        console.error("Error adding sales order: ", error);
        res.status(500).send("Error adding sales order");
    }
});

// GET a single sales order by ID
router.get('/:id', async (req, res) => {
    try {
        const soId = req.params.id;
        const soRef = db.collection('salesOrders').doc(soId);
        const doc = await soRef.get();
        if (!doc.exists) {
            return res.status(404).json({ message: 'Sales Order not found' });
        }
        res.json({ id: doc.id, ...doc.data() });
    } catch (error) {
        console.error("Error getting sales order: ", error);
        res.status(500).send("Error getting sales order");
    }
});

// PUT (update) a sales order by ID
router.put('/:id', async (req, res) => {
    try {
        const soId = req.params.id;
        const soRef = db.collection('salesOrders').doc(soId);
        const doc = await soRef.get();
        if (!doc.exists) {
            return res.status(404).json({ message: 'Sales Order not found' });
        }
        await soRef.update(req.body);
        res.json({ id: soId, ...req.body });
    } catch (error) {
        console.error("Error updating sales order: ", error);
        res.status(500).send("Error updating sales order");
    }
});

// DELETE a sales order by ID
router.delete('/:id', async (req, res) => {
    try {
        const soId = req.params.id;
        const soRef = db.collection('salesOrders').doc(soId);
        const doc = await soRef.get();
        if (!doc.exists) {
            return res.status(404).json({ message: 'Sales Order not found' });
        }
        await soRef.delete();
        res.status(204).send(); // No Content
    } catch (error) {
        console.error("Error deleting sales order: ", error);
        res.status(500).send("Error deleting sales order");
    }
});

module.exports = router;