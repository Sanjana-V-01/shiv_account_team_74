import React, { useState, useEffect } from 'react';
import api from '../api'; // Import the custom axios instance

const CustomerPortalPage = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [receivingInvoice, setReceivingInvoice] = useState(null); // For inline payment form

    const userId = localStorage.getItem('userId'); // Get logged-in user's ID

    useEffect(() => {
        if (userId) {
            fetchInvoicesForUser(userId);
        } else {
            setError("User ID not found. Please log in.");
            setLoading(false);
        }
    }, [userId]);

    const fetchInvoicesForUser = async (id) => {
        setLoading(true);
        setError('');
        try {
            // Assuming a backend endpoint to get invoices by customer ID
            // We need to add this endpoint to customerInvoices.js
            const res = await api.get(`/customer-invoices?customerId=${id}`);
            setInvoices(res.data);
        } catch (err) {
            console.error("Error fetching customer invoices for portal:", err);
            setError("Could not load your invoices.");
        }
        setLoading(false);
    };

    const handleSaveReceipt = () => {
        setReceivingInvoice(null); // Hide the form
        fetchInvoicesForUser(userId); // Refresh the list
    };

    if (loading) return <p>Loading your invoices...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!userId) return <p>Please log in to view your invoices.</p>;

    return (
        <div>
            <h2>Your Invoices</h2>
            {receivingInvoice && <ReceiptForm invoice={receivingInvoice} onSave={handleSaveReceipt} onCancel={() => setReceivingInvoice(null)} />}
            <hr />
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid #ddd' }}>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Invoice ID</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Invoice Date</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Due Date</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Total Amount</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Status</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.length === 0 && !loading ? (
                        <tr><td colSpan="6" style={{ textAlign: 'center', padding: '8px' }}>No invoices found.</td></tr>
                    ) : (
                        invoices.map(invoice => (
                            <tr key={invoice.id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '8px' }}>INV-{invoice.id}</td>
                                <td style={{ padding: '8px' }}>{invoice.invoiceDate}</td>
                                <td style={{ padding: '8px' }}>{invoice.dueDate}</td>
                                <td style={{ padding: '8px' }}>{invoice.totalAmount.toFixed(2)}</td>
                                <td style={{ padding: '8px' }}>{invoice.status}</td>
                                <td style={{ padding: '8px' }}>
                                    {invoice.status === 'Open' && (
                                        <button onClick={() => setReceivingInvoice(invoice)}>Pay Now</button>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

// Re-using the ReceiptForm component from CustomerInvoiceListPage
const ReceiptForm = ({ invoice, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        receiptDate: new Date().toISOString().slice(0, 10),
        paymentMethod: 'Cash',
        amount: invoice.totalAmount.toFixed(2)
    });

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/receipts', { ...formData, customerInvoiceId: invoice.id });
            onSave();
        } catch (err) {
            console.error("Error saving receipt:", err);
            alert(err.response?.data?.message || "Failed to save receipt.");
        }
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
            <h4>Pay Invoice INV-{invoice.id}</h4>
            <form onSubmit={onSubmit}>
                <label>Receipt Date: </label>
                <input type="date" name="receiptDate" value={formData.receiptDate} onChange={onChange} required />
                <label style={{ marginLeft: '1rem' }}>Amount: </label>
                <input type="number" name="amount" value={formData.amount} onChange={onChange} required step="0.01" />
                <label style={{ marginLeft: '1rem' }}>Method: </label>
                <select name="paymentMethod" value={formData.paymentMethod} onChange={onChange}>
                    <option value="Cash">Cash</option>
                    <option value="Bank">Bank</option>
                </select>
                <button type="submit" style={{ marginLeft: '1rem' }}>Confirm Payment</button>
                <button type="button" onClick={onCancel}>Cancel</button>
            </form>
        </div>
    );
};

export default CustomerPortalPage;
