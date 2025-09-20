const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'db', 'purchaseOrders.json');

const readPurchaseOrders = () => {
    try {
        const data = fs.readFileSync(dbPath);
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') return []; // Return empty array if file doesn't exist
        throw error;
    }
};

const writePurchaseOrders = (purchaseOrders) => {
    fs.writeFileSync(dbPath, JSON.stringify(purchaseOrders, null, 2));
};

// GET all purchase orders
router.get('/', (req, res) => {
    res.json(readPurchaseOrders());
});

// POST a new purchase order
router.post('/', (req, res) => {
    const purchaseOrders = readPurchaseOrders();
    const newPurchaseOrder = {
        id: purchaseOrders.length > 0 ? purchaseOrders[purchaseOrders.length - 1].id + 1 : 1,
        status: 'Draft', // Default status
        ...req.body
    };
    purchaseOrders.push(newPurchaseOrder);
    writePurchaseOrders(purchaseOrders);
    res.status(201).json(newPurchaseOrder);
});

// GET a single purchase order by ID
router.get('/:id', (req, res) => {
    const purchaseOrders = readPurchaseOrders();
    const po = purchaseOrders.find(p => p.id === parseInt(req.params.id));
    if (!po) return res.status(404).json({ message: 'Purchase Order not found' });
    res.json(po);
});

// PUT (update) a purchase order by ID
router.put('/:id', (req, res) => {
    let purchaseOrders = readPurchaseOrders();
    const index = purchaseOrders.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: 'Purchase Order not found' });

    purchaseOrders[index] = { ...purchaseOrders[index], ...req.body };
    writePurchaseOrders(purchaseOrders);
    res.json(purchaseOrders[index]);
});

// DELETE a purchase order by ID
router.delete('/:id', (req, res) => {
    let purchaseOrders = readPurchaseOrders();
    const filtered = purchaseOrders.filter(p => p.id !== parseInt(req.params.id));
    if (purchaseOrders.length === filtered.length) {
        return res.status(404).json({ message: 'Purchase Order not found' });
    }
    writePurchaseOrders(filtered);
    res.status(204).send();
});

module.exports = router;
