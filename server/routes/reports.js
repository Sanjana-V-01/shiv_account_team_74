const express = require('express');
const router = express.Router();
const { db } = require('../index'); // Import Firestore instance

// Helper function to get date N days ago
const getDateNDaysAgo = (n) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().slice(0, 10);
};

// GET /api/reports/profit-loss
router.get('/profit-loss', async (req, res) => {
    try {
        const invoicesSnapshot = await db.collection('customerInvoices').get();
        const billsSnapshot = await db.collection('vendorBills').get();

        const invoices = invoicesSnapshot.docs.map(doc => doc.data());
        const bills = billsSnapshot.docs.map(doc => doc.data());

        // Calculate total income from all invoices (Open or Paid)
        const totalIncome = invoices.reduce((sum, invoice) => sum + parseFloat(invoice.totalAmount || 0), 0);

        // Calculate total expenses from all bills (Open or Paid)
        const totalExpenses = bills.reduce((sum, bill) => sum + parseFloat(bill.totalAmount || 0), 0);

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
router.get('/stock-account', async (req, res) => {
    try {
        const productsSnapshot = await db.collection('products').get();
        const allProducts = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        res.json(allProducts);

    } catch (error) {
        console.error("Error generating Stock Account report:", error);
        res.status(500).json({ message: "Failed to generate report." });
    }
});

// GET /api/reports/balance-sheet
router.get('/balance-sheet', async (req, res) => {
    try {
        const invoicesSnapshot = await db.collection('customerInvoices').get();
        const billsSnapshot = await db.collection('vendorBills').get();
        const paymentsSnapshot = await db.collection('payments').get();
        const receiptsSnapshot = await db.collection('receipts').get();

        const invoices = invoicesSnapshot.docs.map(doc => doc.data());
        const bills = billsSnapshot.docs.map(doc => doc.data());
        const payments = paymentsSnapshot.docs.map(doc => doc.data());
        const receipts = receiptsSnapshot.docs.map(doc => doc.data());

        let cashAndBank = 0;
        let accountsReceivable = 0;
        let accountsPayable = 0;

        // Calculate Cash and Bank (simplified: total receipts - total payments)
        const totalReceipts = receipts.reduce((sum, r) => sum + parseFloat(r.amount || 0), 0);
        const totalPayments = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
        cashAndBank = totalReceipts - totalPayments;

        // Calculate Accounts Receivable (sum of open invoices)
        accountsReceivable = invoices.reduce((sum, invoice) => {
            return sum + (invoice.status === 'Open' ? parseFloat(invoice.totalAmount || 0) : 0);
        }, 0);

        // Calculate Accounts Payable (sum of open bills)
        accountsPayable = bills.reduce((sum, bill) => {
            return sum + (bill.status === 'Open' ? parseFloat(bill.totalAmount || 0) : 0);
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

// GET /api/reports/dashboard-summary
router.get('/dashboard-summary', async (req, res) => {
    try {
        const invoicesSnapshot = await db.collection('customerInvoices').get();
        const billsSnapshot = await db.collection('vendorBills').get();
        const paymentsSnapshot = await db.collection('payments').get();
        const receiptsSnapshot = await db.collection('receipts').get();

        const invoices = invoicesSnapshot.docs.map(doc => doc.data());
        const bills = billsSnapshot.docs.map(doc => doc.data());
        const payments = paymentsSnapshot.docs.map(doc => doc.data());
        const receipts = receiptsSnapshot.docs.map(doc => doc.data());

        const today = new Date().toISOString().slice(0, 10);
        const yesterday = getDateNDaysAgo(1);
        const sevenDaysAgo = getDateNDaysAgo(7);
        const thirtyDaysAgo = getDateNDaysAgo(30);

        const filterByDate = (data, dateField, startDate) => {
            return data.filter(item => item[dateField] >= startDate);
        };

        const calculateTotalAmount = (data) => {
            return data.reduce((sum, item) => sum + parseFloat(item.totalAmount || 0), 0);
        };

        const calculatePaymentAmount = (data) => {
            return data.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
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

// GET /api/reports/partner-ledger
router.get('/partner-ledger', async (req, res) => {
    try {
        const contactId = req.query.contactId; // Firestore IDs are strings
        if (!contactId) {
            return res.status(400).json({ message: 'A valid contactId is required.' });
        }

        const contactsSnapshot = await db.collection('contacts').doc(contactId).get();
        const targetContact = contactsSnapshot.data();
        if (!targetContact) {
            return res.status(404).json({ message: 'Contact not found.' });
        }

        const invoicesSnapshot = await db.collection('customerInvoices').get();
        const billsSnapshot = await db.collection('vendorBills').get();
        const paymentsSnapshot = await db.collection('payments').get();
        const receiptsSnapshot = await db.collection('receipts').get();

        const invoices = invoicesSnapshot.docs.map(doc => doc.data());
        const bills = billsSnapshot.docs.map(doc => doc.data());
        const payments = paymentsSnapshot.docs.map(doc => doc.data());
        const receipts = receiptsSnapshot.docs.map(doc => doc.data());

        let ledgerEntries = [];

        // Add customer invoices for this contact
        invoices.filter(inv => inv.customer && inv.customer.id === contactId).forEach(inv => {
            ledgerEntries.push({
                date: inv.invoiceDate,
                type: 'Invoice',
                ref: `INV-${inv.id}`,
                description: `Sale to ${inv.customer.name}`,
                debit: parseFloat(inv.totalAmount || 0), // Increases what customer owes
                credit: 0,
                balanceImpact: parseFloat(inv.totalAmount || 0) // Positive for customer balance
            });
        });

        // Add customer receipts for this contact
        receipts.filter(rec => rec.customerInvoiceId && invoices.find(inv => inv.id === rec.customerInvoiceId && inv.customer.id === contactId)).forEach(rec => {
            ledgerEntries.push({
                date: rec.receiptDate,
                type: 'Receipt',
                ref: `REC-${rec.id}`,
                description: `Payment from ${targetContact.name}`,
                debit: 0,
                credit: parseFloat(rec.amount || 0), // Decreases what customer owes
                balanceImpact: -parseFloat(rec.amount || 0) // Negative for customer balance
            });
        });

        // Add vendor bills for this contact
        bills.filter(bill => bill.vendor && bill.vendor.id === contactId).forEach(bill => {
            ledgerEntries.push({
                date: bill.billDate,
                type: 'Bill',
                ref: `BILL-${bill.id}`,
                description: `Purchase from ${bill.vendor.name}`,
                debit: 0,
                credit: parseFloat(bill.totalAmount || 0), // Increases what we owe vendor
                balanceImpact: -parseFloat(bill.totalAmount || 0) // Negative for vendor balance
            });
        });

        // Add vendor payments for this contact
        payments.filter(pay => pay.vendorBillId && bills.find(bill => bill.id === pay.vendorBillId && bill.vendor.id === contactId)).forEach(pay => {
            ledgerEntries.push({
                date: pay.paymentDate,
                type: 'Payment',
                ref: `PAY-${pay.id}`,
                description: `Payment to ${targetContact.name}`,
                debit: parseFloat(pay.amount || 0), // Decreases what we owe vendor
                credit: 0,
                balanceImpact: parseFloat(pay.amount || 0) // Positive for vendor balance
            });
        });

        // Sort entries by date
        ledgerEntries.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Calculate running balance
        let runningBalance = 0;
        const finalLedger = ledgerEntries.map(entry => {
            runningBalance += entry.balanceImpact;
            return { ...entry, runningBalance: runningBalance };
        });

        res.json({
            contact: targetContact,
            ledger: finalLedger
        });

    } catch (error) {
        console.error("Error generating Partner Ledger report:", error);
        res.status(500).json({ message: "Failed to generate report." });
    }
});

module.exports = router;