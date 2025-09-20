const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = { db };

const express = require('express');
const cors = require('cors');
const path = require('path'); // Import path module
const app = express();
const port = 3001; // Port for the backend server

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from uploads directory

app.get('/', (req, res) => {
  res.send('Shiv Accounts API is running!');
});

// API Routes
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contacts'); // Import contacts routes
app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/products', require('./routes/products')); // Use products routes
app.use('/api/taxes', require('./routes/taxes')); // Use taxes routes
app.use('/api/accounts', require('./routes/accounts')); // Use accounts routes
app.use('/api/purchase-orders', require('./routes/purchaseOrders')); // Use purchase orders routes
app.use('/api/vendor-bills', require('./routes/vendorBills')); // Use vendor bills routes
app.use('/api/payments', require('./routes/payments')); // Use payments routes
app.use('/api/sales-orders', require('./routes/salesOrders')); // Use sales orders routes
app.use('/api/customer-invoices', require('./routes/customerInvoices')); // Use customer invoices routes
app.use('/api/receipts', require('./routes/receipts')); // Use receipts routes
app.use('/api/reports', require('./routes/reports')); // Use reports routes // Use contacts routes
app.use('/api/users', require('./routes/users')); // Use users routes

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
