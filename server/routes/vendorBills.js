const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const billsDbPath = path.join(__dirname, '..', 'db', 'vendorBills.json');
const poDbPath = path.join(__dirname, '..', 'db', 'purchaseOrders.json');

// Helper functions to read/write data
const readData = (dbPath) => {
    try {
        const data = fs.readFileSync(dbPath);
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') return [];
        throw error;
    }
};

const writeData = (dbPath, data) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// GET all vendor bills
router.get('/', (req, res) => {
    res.json(readData(billsDbPath));
});

// POST a new vendor bill from a purchase order
router.post('/', (req, res) => {
    const { purchaseOrderId } = req.body;
    if (!purchaseOrderId) {
        return res.status(400).json({ message: 'Purchase Order ID is required.' });
    }

    const purchaseOrders = readData(poDbPath);
    const poIndex = purchaseOrders.findIndex(p => p.id === parseInt(purchaseOrderId));

    if (poIndex === -1) {
        return res.status(404).json({ message: 'Purchase Order not found.' });
    }

    const po = purchaseOrders[poIndex];

    if (po.status === 'Billed') {
        return res.status(400).json({ message: 'This Purchase Order has already been billed.' });
    }

    const bills = readData(billsDbPath);
    const newBill = {
        id: bills.length > 0 ? bills[bills.length - 1].id + 1 : 1,
        purchaseOrderId: po.id,
        vendor: po.vendor,
        billDate: new Date().toISOString().slice(0, 10),
        dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().slice(0, 10), // Default due date 30 days from now
        items: po.items,
        totalAmount: po.totalAmount,
        status: 'Open'
    };

    bills.push(newBill);
    writeData(billsDbPath, bills);

    // Update the PO status
    purchaseOrders[poIndex].status = 'Billed';
    writeData(poDbPath, purchaseOrders);

    res.status(201).json(newBill);
});

module.exports = router;
