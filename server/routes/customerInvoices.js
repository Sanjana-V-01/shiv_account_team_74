const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const invoicesDbPath = path.join(__dirname, '..', 'db', 'customerInvoices.json');
const soDbPath = path.join(__dirname, '..', 'db', 'salesOrders.json');

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

// GET all customer invoices
router.get('/', (req, res) => {
    res.json(readData(invoicesDbPath));
});

// POST a new customer invoice from a sales order
router.post('/', (req, res) => {
    const { salesOrderId } = req.body;
    if (!salesOrderId) {
        return res.status(400).json({ message: 'Sales Order ID is required.' });
    }

    const salesOrders = readData(soDbPath);
    const soIndex = salesOrders.findIndex(s => s.id === parseInt(salesOrderId));

    if (soIndex === -1) {
        return res.status(404).json({ message: 'Sales Order not found.' });
    }

    const so = salesOrders[soIndex];

    if (so.status === 'Invoiced') {
        return res.status(400).json({ message: 'This Sales Order has already been invoiced.' });
    }

    const invoices = readData(invoicesDbPath);
    const newInvoice = {
        id: invoices.length > 0 ? invoices[invoices.length - 1].id + 1 : 1,
        salesOrderId: so.id,
        customer: so.customer,
        invoiceDate: new Date().toISOString().slice(0, 10),
        dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().slice(0, 10), // Default due date 30 days from now
        items: so.items,
        totalAmount: so.totalAmount,
        status: 'Open'
    };

    invoices.push(newInvoice);
    writeData(invoicesDbPath, invoices);

    // Update the SO status
    salesOrders[soIndex].status = 'Invoiced';
    writeData(soDbPath, salesOrders);

    res.status(201).json(newInvoice);
});

module.exports = router;
