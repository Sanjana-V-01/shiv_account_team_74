const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'db', 'products.json');

// Function to read products from the database
const readProducts = () => {
    const data = fs.readFileSync(dbPath);
    return JSON.parse(data);
};

// Function to write products to the database
const writeProducts = (products) => {
    fs.writeFileSync(dbPath, JSON.stringify(products, null, 2));
};

// GET all products
router.get('/', (req, res) => {
    const products = readProducts();
    res.json(products);
});

// POST a new product
router.post('/', (req, res) => {
    const products = readProducts();
    const newProduct = {
        id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
        ...req.body
    };
    products.push(newProduct);
    writeProducts(products);
    res.status(201).json(newProduct);
});

// GET a single product by ID
router.get('/:id', (req, res) => {
    const products = readProducts();
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
});

// PUT (update) a product by ID
router.put('/:id', (req, res) => {
    let products = readProducts();
    const index = products.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: 'Product not found' });

    const updatedProduct = { ...products[index], ...req.body };
    products[index] = updatedProduct;
    writeProducts(products);
    res.json(updatedProduct);
});

// DELETE a product by ID
router.delete('/:id', (req, res) => {
    let products = readProducts();
    const filteredProducts = products.filter(p => p.id !== parseInt(req.params.id));
    if (products.length === filteredProducts.length) {
        return res.status(404).json({ message: 'Product not found' });
    }
    writeProducts(filteredProducts);
    res.status(204).send(); // No Content
});

module.exports = router;
