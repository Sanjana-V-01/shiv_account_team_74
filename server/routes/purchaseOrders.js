const express = require('express');
const router = express.Router();
const { db } = require('../firebase-config'); // Import Firestore instance

// GET all purchase orders
router.get('/', async (req, res) => {
    try {
        const poRef = db.collection('purchaseOrders');
        const snapshot = await poRef.get();
        if (snapshot.empty) {
            return res.json([]);
        }
        const purchaseOrders = [];
        snapshot.forEach(doc => {
            purchaseOrders.push({ id: doc.id, ...doc.data() });
        });
        res.json(purchaseOrders);
    } catch (error) {
        console.error("Error getting purchase orders: ", error);
        res.status(500).send("Error getting purchase orders");
    }
});

// POST a new purchase order
router.post('/', async (req, res) => {
    try {
        const newPurchaseOrder = {
            status: 'Draft', // Default status
            ...req.body
        };
        const docRef = await db.collection('purchaseOrders').add(newPurchaseOrder);
        res.status(201).json({ id: docRef.id, ...newPurchaseOrder });
    } catch (error) {
        console.error("Error adding purchase order: ", error);
        res.status(500).send("Error adding purchase order");
    }
});

// GET a single purchase order by ID
router.get('/:id', async (req, res) => {
    try {
        const poId = req.params.id;
        const poRef = db.collection('purchaseOrders').doc(poId);
        const doc = await poRef.get();
        if (!doc.exists) {
            return res.status(404).json({ message: 'Purchase Order not found' });
        }
        res.json({ id: doc.id, ...doc.data() });
    } catch (error) {
        console.error("Error getting purchase order: ", error);
        res.status(500).send("Error getting purchase order");
    }
});

// PUT (update) a purchase order by ID
router.put('/:id', async (req, res) => {
    try {
        const poId = req.params.id;
        const poRef = db.collection('purchaseOrders').doc(poId);
        const doc = await poRef.get();
        if (!doc.exists) {
            return res.status(404).json({ message: 'Purchase Order not found' });
        }
        await poRef.update(req.body);
        res.json({ id: poId, ...req.body });
    } catch (error) {
        console.error("Error updating purchase order: ", error);
        res.status(500).send("Error updating purchase order");
    }
});

// DELETE a purchase order by ID
router.delete('/:id', async (req, res) => {
    try {
        const poId = req.params.id;
        const poRef = db.collection('purchaseOrders').doc(poId);
        const doc = await poRef.get();
        if (!doc.exists) {
            return res.status(404).json({ message: 'Purchase Order not found' });
        }
        await poRef.delete();
        res.status(204).send(); // No Content
    } catch (error) {
        console.error("Error deleting purchase order: ", error);
        res.status(500).send("Error deleting purchase order");
    }
});

module.exports = router;