const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'db', 'salesOrders.json');

const readSalesOrders = () => {
    try {
        const data = fs.readFileSync(dbPath);
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') return [];
        throw error;
    }
};

const writeSalesOrders = (salesOrders) => {
    fs.writeFileSync(dbPath, JSON.stringify(salesOrders, null, 2));
};

// GET all sales orders
router.get('/', (req, res) => {
    res.json(readSalesOrders());
});

// POST a new sales order
router.post('/', (req, res) => {
    const salesOrders = readSalesOrders();
    const newSalesOrder = {
        id: salesOrders.length > 0 ? salesOrders[salesOrders.length - 1].id + 1 : 1,
        status: 'Draft', // Default status
        ...req.body
    };
    salesOrders.push(newSalesOrder);
    writeSalesOrders(salesOrders);
    res.status(201).json(newSalesOrder);
});

// GET a single sales order by ID
router.get('/:id', (req, res) => {
    const salesOrders = readSalesOrders();
    const so = salesOrders.find(s => s.id === parseInt(req.params.id));
    if (!so) return res.status(404).json({ message: 'Sales Order not found' });
    res.json(so);
});

// PUT (update) a sales order by ID
router.put('/:id', (req, res) => {
    let salesOrders = readSalesOrders();
    const index = salesOrders.findIndex(s => s.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: 'Sales Order not found' });

    salesOrders[index] = { ...salesOrders[index], ...req.body };
    writeSalesOrders(salesOrders);
    res.json(salesOrders[index]);
});

// DELETE a sales order by ID
router.delete('/:id', (req, res) => {
    let salesOrders = readSalesOrders();
    const filtered = salesOrders.filter(s => s.id !== parseInt(req.params.id));
    if (salesOrders.length === filtered.length) {
        return res.status(404).json({ message: 'Sales Order not found' });
    }
    writeSalesOrders(filtered);
    res.status(204).send();
});

module.exports = router;
