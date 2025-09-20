const express = require('express');
const router = express.Router();
const { db } = require('../index'); // Import Firestore instance

// GET all vendor bills
router.get('/', async (req, res) => {
    try {
        const billsRef = db.collection('vendorBills');
        const snapshot = await billsRef.get();
        if (snapshot.empty) {
            return res.json([]);
        }
        const bills = [];
        snapshot.forEach(doc => {
            bills.push({ id: doc.id, ...doc.data() });
        });
        res.json(bills);
    } catch (error) {
        console.error("Error getting vendor bills: ", error);
        res.status(500).send("Error getting vendor bills");
    }
});

// POST a new vendor bill from a purchase order
router.post('/', async (req, res) => {
    const { purchaseOrderId } = req.body;
    if (!purchaseOrderId) {
        return res.status(400).json({ message: 'Purchase Order ID is required.' });
    }

    const poRef = db.collection('purchaseOrders').doc(purchaseOrderId);

    try {
        const poDoc = await poRef.get();

        if (!poDoc.exists) {
            return res.status(404).json({ message: 'Purchase Order not found.' });
        }

        const po = poDoc.data();

        if (po.status === 'Billed') {
            return res.status(400).json({ message: 'This Purchase Order has already been billed.' });
        }

        const newBill = {
            purchaseOrderId: poDoc.id,
            vendor: po.vendor,
            billDate: new Date().toISOString().slice(0, 10),
            dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().slice(0, 10), // Default due date 30 days from now
            items: po.items,
            totalAmount: po.totalAmount,
            status: 'Open'
        };

        // Add the new bill
        const billDocRef = await db.collection('vendorBills').add(newBill);

        // Update the PO status
        await poRef.update({ status: 'Billed' });

        res.status(201).json({ id: billDocRef.id, ...newBill });

    } catch (error) {
        console.error("Error creating vendor bill: ", error);
        res.status(500).send("Error creating vendor bill from Purchase Order");
    }
});

module.exports = router;