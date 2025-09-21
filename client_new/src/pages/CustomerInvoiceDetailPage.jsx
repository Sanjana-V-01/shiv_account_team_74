import React, { useState, useEffect } from 'react';
import api from '../api'; // Import the custom axios instance
import { useParams, Link } from 'react-router-dom';

const CustomerInvoiceDetailPage = () => {
    const { id } = useParams();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const res = await api.get(`/customer-invoices/${id}`);
                setInvoice(res.data);
            } catch (err) {
                setError('Failed to fetch customer invoice.');
                console.error(err);
            }
            setLoading(false);
        };

        fetchInvoice();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!invoice) return <p>Customer Invoice not found.</p>;

    const calculateTotal = (items) => {
        if (!items) return 0;
        return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    }

    return (
        <div>
            <Link to="/customer-invoices"> &larr; Back to Customer Invoices</Link>
            <h2>Customer Invoice: INV-{invoice.id}</h2>
            
            <div>
                <p><strong>SO ID:</strong> SO-{invoice.salesOrderId}</p>
                <p><strong>Customer:</strong> {invoice.customer ? invoice.customer.name : 'N/A'}</p>
                <p><strong>Invoice Date:</strong> {invoice.invoiceDate}</p>
                <p><strong>Due Date:</strong> {invoice.dueDate}</p>
                <p><strong>Status:</strong> {invoice.status}</p>
            </div>

            <h3 style={{marginTop: '2rem'}}>Items</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid #ddd' }}>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Product</th>
                        <th style={{ textAlign: 'right', padding: '8px' }}>Quantity</th>
                        <th style={{ textAlign: 'right', padding: '8px' }}>Unit Price</th>
                        <th style={{ textAlign: 'right', padding: '8px' }}>Line Total</th>
                    </tr>
                </thead>
                <tbody>
                    {invoice.items && invoice.items.map((item, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '8px' }}>{item.product ? item.product.name : 'N/A'}</td>
                            <td style={{ textAlign: 'right', padding: '8px' }}>{item.quantity}</td>
                            <td style={{ textAlign: 'right', padding: '8px' }}>{item.unitPrice.toFixed(2)}</td>
                            <td style={{ textAlign: 'right', padding: '8px' }}>{(item.quantity * item.unitPrice).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan="3" style={{ textAlign: 'right', padding: '8px' }}><strong>Total:</strong></td>
                        <td style={{ textAlign: 'right', padding: '8px' }}><strong>{calculateTotal(invoice.items).toFixed(2)}</strong></td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default CustomerInvoiceDetailPage;
