const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Helper function to read data files
const readData = (dbPath) => {
    try {
        const data = fs.readFileSync(dbPath);
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') return [];
        throw error;
    }
};

// GET /api/reports/profit-loss
router.get('/profit-loss', (req, res) => {
    try {
        const invoicesDbPath = path.join(__dirname, '..', 'db', 'customerInvoices.json');
        const billsDbPath = path.join(__dirname, '..', 'db', 'vendorBills.json');

        const invoices = readData(invoicesDbPath);
        const bills = readData(billsDbPath);

        // Calculate total income from all invoices (Open or Paid)
        const totalIncome = invoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0);

        // Calculate total expenses from all bills (Open or Paid)
        const totalExpenses = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);

        const netProfit = totalIncome - totalExpenses;

        res.json({
            totalIncome,
            totalExpenses,
            netProfit
        });

    } catch (error) {
        console.error("Error generating P&L report:", error);
        res.status(500).json({ message: "Failed to generate report." });
    }
});

// GET /api/reports/stock-account
router.get('/stock-account', (req, res) => {
    try {
        const productsDbPath = path.join(__dirname, '..', 'db', 'products.json');
        const poDbPath = path.join(__dirname, '..', 'db', 'purchaseOrders.json');
        const soDbPath = path.join(__dirname, '..', 'db', 'salesOrders.json');

        const allProducts = readData(productsDbPath);
        const purchaseOrders = readData(poDbPath);
        const salesOrders = readData(soDbPath);

        const stockMap = new Map();

        // Initialize stock for all products
        allProducts.forEach(p => {
            stockMap.set(p.id, { ...p, currentStock: 0 });
        });

        // Process purchases
        purchaseOrders.forEach(po => {
            po.items.forEach(item => {
                const product = stockMap.get(item.product.id);
                if (product) {
                    product.currentStock += item.quantity;
                }
            });
        });

        // Process sales
        salesOrders.forEach(so => {
            so.items.forEach(item => {
                const product = stockMap.get(item.product.id);
                if (product) {
                    product.currentStock -= item.quantity;
                }
            });
        });

        res.json(Array.from(stockMap.values()));

    } catch (error) {
        console.error("Error generating Stock Account report:", error);
        res.status(500).json({ message: "Failed to generate report." });
    }
});

// GET /api/reports/balance-sheet
router.get('/balance-sheet', (req, res) => {
    try {
        const invoicesDbPath = path.join(__dirname, '..', 'db', 'customerInvoices.json');
        const billsDbPath = path.join(__dirname, '..', 'db', 'vendorBills.json');
        const paymentsDbPath = path.join(__dirname, '..', 'db', 'payments.json');
        const receiptsDbPath = path.join(__dirname, '..', 'db', 'receipts.json');

        const invoices = readData(invoicesDbPath);
        const bills = readData(billsDbPath);
        const payments = readData(paymentsDbPath);
        const receipts = readData(receiptsDbPath);

        let cashAndBank = 0;
        let accountsReceivable = 0;
        let accountsPayable = 0;

        // Calculate Cash and Bank (simplified: total receipts - total payments)
        const totalReceipts = receipts.reduce((sum, r) => sum + parseFloat(r.amount), 0);
        const totalPayments = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
        cashAndBank = totalReceipts - totalPayments;

        // Calculate Accounts Receivable (sum of open invoices)
        accountsReceivable = invoices.reduce((sum, invoice) => {
            return sum + (invoice.status === 'Open' ? invoice.totalAmount : 0);
        }, 0);

        // Calculate Accounts Payable (sum of open bills)
        accountsPayable = bills.reduce((sum, bill) => {
            return sum + (bill.status === 'Open' ? bill.totalAmount : 0);
        }, 0);

        const totalAssets = cashAndBank + accountsReceivable; // Add other assets if tracked
        const totalLiabilities = accountsPayable; // Add other liabilities if tracked
        const equity = totalAssets - totalLiabilities; // Derived equity

        res.json({
            assets: {
                cashAndBank: cashAndBank,
                accountsReceivable: accountsReceivable,
                // Add other assets here if implemented (e.g., Inventory, Fixed Assets)
                total: totalAssets
            },
            liabilities: {
                accountsPayable: accountsPayable,
                // Add other liabilities here if implemented (e.g., Loans)
                total: totalLiabilities
            },
            equity: {
                retainedEarnings: equity, // Simplified for hackathon
                total: equity
            }
        });

    } catch (error) {
        console.error("Error generating Balance Sheet report:", error);
        res.status(500).json({ message: "Failed to generate report." });
    }
});

// Helper function to get date N days ago
const getDateNDaysAgo = (n) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().slice(0, 10);
};

// GET /api/reports/dashboard-summary
router.get('/dashboard-summary', (req, res) => {
    try {
        const invoicesDbPath = path.join(__dirname, '..', 'db', 'customerInvoices.json');
        const billsDbPath = path.join(__dirname, '..', 'db', 'vendorBills.json');
        const paymentsDbPath = path.join(__dirname, '..', 'db', 'payments.json');
        const receiptsDbPath = path.join(__dirname, '..', 'db', 'receipts.json');

        const invoices = readData(invoicesDbPath);
        const bills = readData(billsDbPath);
        const payments = readData(paymentsDbPath);
        const receipts = readData(receiptsDbPath);

        const today = new Date().toISOString().slice(0, 10);
        const yesterday = getDateNDaysAgo(1);
        const sevenDaysAgo = getDateNDaysAgo(7);
        const thirtyDaysAgo = getDateNDaysAgo(30);

        const filterByDate = (data, dateField, startDate) => {
            return data.filter(item => item[dateField] >= startDate);
        };

        const calculateTotalAmount = (data) => {
            return data.reduce((sum, item) => sum + item.totalAmount, 0);
        };

        const calculatePaymentAmount = (data) => {
            return data.reduce((sum, item) => sum + parseFloat(item.amount), 0);
        };

        // Invoices
        const invoices24hr = filterByDate(invoices, 'invoiceDate', yesterday);
        const invoices7days = filterByDate(invoices, 'invoiceDate', sevenDaysAgo);
        const invoices30days = filterByDate(invoices, 'invoiceDate', thirtyDaysAgo);

        // Bills (Purchases)
        const bills24hr = filterByDate(bills, 'billDate', yesterday);
        const bills7days = filterByDate(bills, 'billDate', sevenDaysAgo);
        const bills30days = filterByDate(bills, 'billDate', thirtyDaysAgo);

        // Payments (Vendor Payments)
        const payments24hr = filterByDate(payments, 'paymentDate', yesterday);
        const payments7days = filterByDate(payments, 'paymentDate', sevenDaysAgo);
        const payments30days = filterByDate(payments, 'paymentDate', thirtyDaysAgo);

        // Receipts (Customer Receipts)
        const receipts24hr = filterByDate(receipts, 'receiptDate', yesterday);
        const receipts7days = filterByDate(receipts, 'receiptDate', sevenDaysAgo);
        const receipts30days = filterByDate(receipts, 'receiptDate', thirtyDaysAgo);

        res.json({
            totalInvoices: {
                last24hr: calculateTotalAmount(invoices24hr),
                last7days: calculateTotalAmount(invoices7days),
                last30days: calculateTotalAmount(invoices30days)
            },
            totalPurchases: {
                last24hr: calculateTotalAmount(bills24hr),
                last7days: calculateTotalAmount(bills7days),
                last30days: calculateTotalAmount(bills30days)
            },
            totalPayments: {
                last24hr: calculatePaymentAmount(payments24hr),
                last7days: calculatePaymentAmount(payments7days),
                last30days: calculatePaymentAmount(payments30days)
            },
            totalReceipts: {
                last24hr: calculatePaymentAmount(receipts24hr),
                last7days: calculatePaymentAmount(receipts7days),
                last30days: calculatePaymentAmount(receipts30days)
            }
        });

    } catch (error) {
        console.error("Error generating Dashboard summary:", error);
        res.status(500).json({ message: "Failed to generate dashboard summary." });
    }
});

module.exports = router;