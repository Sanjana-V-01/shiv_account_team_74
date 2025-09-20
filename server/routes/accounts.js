const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'db', 'accounts.json');

const readAccounts = () => {
    const data = fs.readFileSync(dbPath);
    return JSON.parse(data);
};

const writeAccounts = (accounts) => {
    fs.writeFileSync(dbPath, JSON.stringify(accounts, null, 2));
};

router.get('/', (req, res) => {
    res.json(readAccounts());
});

router.post('/', (req, res) => {
    const accounts = readAccounts();
    const newAccount = {
        id: accounts.length > 0 ? accounts[accounts.length - 1].id + 1 : 1,
        ...req.body
    };
    accounts.push(newAccount);
    writeAccounts(accounts);
    res.status(201).json(newAccount);
});

router.put('/:id', (req, res) => {
    let accounts = readAccounts();
    const index = accounts.findIndex(a => a.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: 'Account not found' });

    accounts[index] = { ...accounts[index], ...req.body };
    writeAccounts(accounts);
    res.json(accounts[index]);
});

router.delete('/:id', (req, res) => {
    let accounts = readAccounts();
    const filteredAccounts = accounts.filter(a => a.id !== parseInt(req.params.id));
    if (accounts.length === filteredAccounts.length) {
        return res.status(404).json({ message: 'Account not found' });
    }
    writeAccounts(filteredAccounts);
    res.status(204).send();
});

module.exports = router;
