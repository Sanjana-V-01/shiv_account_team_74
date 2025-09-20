const express = require('express');
const router = express.Router();
const { db } = require('../index');

// GET all payments
router.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('payments').get();
        const payments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(payments);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// POST a new payment for a vendor bill
router.post('/', async (req, res) => {
    const { vendorBillId, amount, paymentDate, paymentMethod } = req.body;
    if (!vendorBillId || !amount || !paymentDate || !paymentMethod) {
        return res.status(400).json({ message: 'Missing required payment information.' });
    }

    const billRef = db.collection('vendorBills').doc(vendorBillId);

    try {
        const billDoc = await billRef.get();
        if (!billDoc.exists) {
            return res.status(404).json({ message: 'Vendor Bill not found.' });
        }

        if (billDoc.data().status === 'Paid') {
            return res.status(400).json({ message: 'This bill has already been paid.' });
        }

        const newPayment = { ...req.body };
        const paymentRef = await db.collection('payments').add(newPayment);

        await billRef.update({ status: 'Paid' });

        res.status(201).json({ id: paymentRef.id, ...newPayment });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;