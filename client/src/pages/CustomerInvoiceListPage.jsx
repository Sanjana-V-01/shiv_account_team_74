import React, { useState, useEffect } from 'react';
import api from '../api'; // Import the custom axios instance
import { Link } from 'react-router-dom';

const ReceiptForm = ({ invoice, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        receiptDate: new Date().toISOString().slice(0, 10),
        paymentMethod: 'Cash',
        amount: parseFloat(invoice.totalAmount || 0).toFixed(2)
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
            <h4>Register Receipt for INV-{invoice.id}</h4>
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
                <button type="submit" style={{ marginLeft: '1rem' }}>Receive</button>
                <button type="button" onClick={onCancel}>Cancel</button>
            </form>
        </div>
    );
};

const CustomerInvoiceListPage = () => {
    const [invoices, setInvoices] = useState([]);
    const [receivingInvoice, setReceivingInvoice] = useState(null); // State to track which invoice is being paid
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const res = await api.get('/customer-invoices');
            setInvoices(res.data);
        } catch (err) {
            console.error("Error fetching customer invoices:", err);
            setError("Failed to load customer invoices.");
        }
        setLoading(false);
    };

    const handleSaveReceipt = () => {
        setReceivingInvoice(null); // Hide the form
        fetchInvoices(); // Refresh the list
    };

    const handleDelete = async (invoiceId) => {
        if (window.confirm("Are you sure you want to delete this customer invoice? This action cannot be undone.")) {
            try {
                await api.delete(`/customer-invoices/${invoiceId}`);
                fetchInvoices(); // Refresh the list
            } catch (err) {
                console.error("Error deleting customer invoice:", err);
                alert("Failed to delete customer invoice.");
            }
        }
    };

    return (
        <div>
            <h2>Customer Invoices</h2>
            {receivingInvoice && <ReceiptForm invoice={receivingInvoice} onSave={handleSaveReceipt} onCancel={() => setReceivingInvoice(null)} />}
            <hr />
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid #ddd' }}>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Invoice ID</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>SO ID</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Customer</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Due Date</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Total Amount</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Status</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.length === 0 ? (
                        <tr><td colSpan="7" style={{ textAlign: 'center', padding: '8px' }}>No customer invoices found.</td></tr>
                    ) : (
                        invoices.map(invoice => (
                            <tr key={invoice.id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '8px' }}>
                                    {invoice.id && (
                                        <Link to={`/customer-invoices/${invoice.id}`}>INV-{invoice.id}</Link>
                                    )}
                                </td>
                                <td style={{ padding: '8px' }}>SO-{invoice.salesOrderId}</td>
                                <td style={{ padding: '8px' }}>{invoice.customer ? invoice.customer.name : 'N/A'}</td>
                                <td style={{ padding: '8px' }}>{invoice.dueDate}</td>
                                <td style={{ padding: '8px' }}>{parseFloat(invoice.totalAmount || 0).toFixed(2)}</td>
                                <td style={{ padding: '8px' }}>{invoice.status}</td>
                                <td style={{ padding: '8px' }}>
                                    {invoice.status === 'Open' && (
                                        <button onClick={() => setReceivingInvoice(invoice)}>Register Receipt</button>
                                    )}
                                    <button onClick={() => handleDelete(invoice.id)} style={{ marginLeft: '0.5rem' }}>Delete</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default CustomerInvoiceListPage;
