const express = require('express');
const router = express.Router();
const { db } = require('../firebase-config'); // Import Firestore instance

// GET all products
router.get('/', async (req, res) => {
    try {
        const productsRef = db.collection('products');
        const snapshot = await productsRef.get();
        if (snapshot.empty) {
            return res.json([]);
        }
        const products = [];
        snapshot.forEach(doc => {
            products.push({ id: doc.id, ...doc.data() });
        });
        res.json(products);
    } catch (error) {
        console.error("Error getting products: ", error);
        res.status(500).send("Error getting products");
    }
});

// POST a new product
router.post('/', async (req, res) => {
    try {
        const newProduct = req.body;
        const docRef = await db.collection('products').add(newProduct);
        res.status(201).json({ id: docRef.id, ...newProduct });
    } catch (error) {
        console.error("Error adding product: ", error);
        res.status(500).send("Error adding product");
    }
});

// GET a single product by ID
router.get('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const productRef = db.collection('products').doc(productId);
        const doc = await productRef.get();
        if (!doc.exists) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ id: doc.id, ...doc.data() });
    } catch (error) {
        console.error("Error getting product: ", error);
        res.status(500).send("Error getting product");
    }
});

// PUT (update) a product by ID
router.put('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const productRef = db.collection('products').doc(productId);
        const doc = await productRef.get();
        if (!doc.exists) {
            return res.status(404).json({ message: 'Product not found' });
        }
        await productRef.update(req.body);
        res.json({ id: productId, ...req.body });
    } catch (error) {
        console.error("Error updating product: ", error);
        res.status(500).send("Error updating product");
    }
});

// DELETE a product by ID
router.delete('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const productRef = db.collection('products').doc(productId);
        const doc = await productRef.get();
        if (!doc.exists) {
            return res.status(404).json({ message: 'Product not found' });
        }
        await productRef.delete();
        res.status(204).send(); // No Content
    } catch (error) {
        console.error("Error deleting product: ", error);
        res.status(500).send("Error deleting product");
    }
});

module.exports = router;