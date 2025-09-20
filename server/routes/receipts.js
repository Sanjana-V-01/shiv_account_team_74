const express = require('express');
const router = express.Router();
const { db } = require('../index');

// GET all receipts
router.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('receipts').get();
        const receipts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(receipts);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// POST a new receipt for a customer invoice
router.post('/', async (req, res) => {
    const { customerInvoiceId, amount, receiptDate, paymentMethod } = req.body;
    if (!customerInvoiceId || !amount || !receiptDate || !paymentMethod) {
        return res.status(400).json({ message: 'Missing required receipt information.' });
    }

    const invoiceRef = db.collection('customerInvoices').doc(customerInvoiceId);

    try {
        const invoiceDoc = await invoiceRef.get();
        if (!invoiceDoc.exists) {
            return res.status(404).json({ message: 'Customer Invoice not found.' });
        }

        if (invoiceDoc.data().status === 'Paid') {
            return res.status(400).json({ message: 'This invoice has already been paid.' });
        }

        const newReceipt = { ...req.body };
        const receiptRef = await db.collection('receipts').add(newReceipt);

        await invoiceRef.update({ status: 'Paid' });

        res.status(201).json({ id: receiptRef.id, ...newReceipt });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;