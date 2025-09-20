const express = require('express');
const router = express.Router();
const { db } = require('../index'); // Import Firestore instance

// GET all customer invoices, with optional customerId filter
router.get('/', async (req, res) => {
    try {
        const customerId = req.query.customerId;
        let query = db.collection('customerInvoices');

        if (customerId) {
            // Firestore queries require strings for comparisons
            query = query.where('customer.id', '==', parseInt(customerId));
        }

        const snapshot = await query.get();
        if (snapshot.empty) {
            return res.json([]);
        }

        const invoices = [];
        snapshot.forEach(doc => {
            invoices.push({ id: doc.id, ...doc.data() });
        });

        res.json(invoices);
    } catch (error) {
        console.error("Error getting customer invoices: ", error);
        res.status(500).send("Error getting customer invoices");
    }
});

// POST a new customer invoice from a sales order
router.post('/', async (req, res) => {
    const { salesOrderId } = req.body;
    if (!salesOrderId) {
        return res.status(400).json({ message: 'Sales Order ID is required.' });
    }

    const soRef = db.collection('salesOrders').doc(salesOrderId);

    try {
        const soDoc = await soRef.get();

        if (!soDoc.exists) {
            return res.status(404).json({ message: 'Sales Order not found.' });
        }

        const so = soDoc.data();

        if (so.status === 'Invoiced') {
            return res.status(400).json({ message: 'This Sales Order has already been invoiced.' });
        }

        const newInvoice = {
            salesOrderId: soDoc.id,
            customer: so.customer,
            invoiceDate: new Date().toISOString().slice(0, 10),
            dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().slice(0, 10),
            items: so.items,
            totalAmount: so.totalAmount,
            status: 'Open'
        };

        const invoiceDocRef = await db.collection('customerInvoices').add(newInvoice);

        // Update the SO status
        await soRef.update({ status: 'Invoiced' });

        res.status(201).json({ id: invoiceDocRef.id, ...newInvoice });

    } catch (error) {
        console.error("Error creating customer invoice: ", error);
        res.status(500).send("Error creating customer invoice from Sales Order");
    }
});

module.exports = router;
