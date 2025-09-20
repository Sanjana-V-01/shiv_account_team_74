const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'db', 'taxes.json');

const readTaxes = () => {
    const data = fs.readFileSync(dbPath);
    return JSON.parse(data);
};

const writeTaxes = (taxes) => {
    fs.writeFileSync(dbPath, JSON.stringify(taxes, null, 2));
};

router.get('/', (req, res) => {
    res.json(readTaxes());
});

router.post('/', (req, res) => {
    const taxes = readTaxes();
    const newTax = {
        id: taxes.length > 0 ? taxes[taxes.length - 1].id + 1 : 1,
        ...req.body
    };
    taxes.push(newTax);
    writeTaxes(taxes);
    res.status(201).json(newTax);
});

router.put('/:id', (req, res) => {
    let taxes = readTaxes();
    const index = taxes.findIndex(t => t.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: 'Tax not found' });

    taxes[index] = { ...taxes[index], ...req.body };
    writeTaxes(taxes);
    res.json(taxes[index]);
});

router.delete('/:id', (req, res) => {
    let taxes = readTaxes();
    const filteredTaxes = taxes.filter(t => t.id !== parseInt(req.params.id));
    if (taxes.length === filteredTaxes.length) {
        return res.status(404).json({ message: 'Tax not found' });
    }
    writeTaxes(filteredTaxes);
    res.status(204).send();
});

module.exports = router;
