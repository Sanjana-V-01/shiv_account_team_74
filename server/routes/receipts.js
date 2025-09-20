const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const receiptsDbPath = path.join(__dirname, '..', 'db', 'receipts.json');
const invoicesDbPath = path.join(__dirname, '..', 'db', 'customerInvoices.json');

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

// GET all receipts
router.get('/', (req, res) => {
    res.json(readData(receiptsDbPath));
});

// POST a new receipt for a customer invoice
router.post('/', (req, res) => {
    const { customerInvoiceId, amount, receiptDate, paymentMethod } = req.body;
    if (!customerInvoiceId || !amount || !receiptDate || !paymentMethod) {
        return res.status(400).json({ message: 'Missing required receipt information.' });
    }

    const invoices = readData(invoicesDbPath);
    const invoiceIndex = invoices.findIndex(i => i.id === parseInt(customerInvoiceId));

    if (invoiceIndex === -1) {
        return res.status(404).json({ message: 'Customer Invoice not found.' });
    }

    if (invoices[invoiceIndex].status === 'Paid') {
        return res.status(400).json({ message: 'This invoice has already been paid.' });
    }

    const receipts = readData(receiptsDbPath);
    const newReceipt = {
        id: receipts.length > 0 ? receipts[receipts.length - 1].id + 1 : 1,
        ...req.body
    };

    receipts.push(newReceipt);
    writeData(receiptsDbPath, receipts);

    // Update the invoice status
    invoices[invoiceIndex].status = 'Paid';
    writeData(invoicesDbPath, invoices);

    res.status(201).json(newReceipt);
});

module.exports = router;
