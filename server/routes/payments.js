const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const paymentsDbPath = path.join(__dirname, '..', 'db', 'payments.json');
const billsDbPath = path.join(__dirname, '..', 'db', 'vendorBills.json');

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

// GET all payments
router.get('/', (req, res) => {
    res.json(readData(paymentsDbPath));
});

// POST a new payment for a vendor bill
router.post('/', (req, res) => {
    const { vendorBillId, amount, paymentDate, paymentMethod } = req.body;
    if (!vendorBillId || !amount || !paymentDate || !paymentMethod) {
        return res.status(400).json({ message: 'Missing required payment information.' });
    }

    const bills = readData(billsDbPath);
    const billIndex = bills.findIndex(b => b.id === parseInt(vendorBillId));

    if (billIndex === -1) {
        return res.status(404).json({ message: 'Vendor Bill not found.' });
    }

    if (bills[billIndex].status === 'Paid') {
        return res.status(400).json({ message: 'This bill has already been paid.' });
    }

    const payments = readData(paymentsDbPath);
    const newPayment = {
        id: payments.length > 0 ? payments[payments.length - 1].id + 1 : 1,
        ...req.body
    };

    payments.push(newPayment);
    writeData(paymentsDbPath, payments);

    // Update the bill status
    bills[billIndex].status = 'Paid';
    writeData(billsDbPath, bills);

    res.status(201).json(newPayment);
});

module.exports = router;
