import React, { useState, useEffect } from 'react';
import api from '../api'; // Import the custom axios instance
import { useParams, Link } from 'react-router-dom';

const VendorBillDetailPage = () => {
    const { id } = useParams();
    const [bill, setBill] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBill = async () => {
            try {
                const res = await api.get(`/vendor-bills/${id}`);
                setBill(res.data);
            } catch (err) {
                setError('Failed to fetch vendor bill.');
                console.error(err);
            }
            setLoading(false);
        };

        fetchBill();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!bill) return <p>Vendor Bill not found.</p>;

    const calculateTotal = (items) => {
        if (!items) return 0;
        return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    }

    return (
        <div>
            <Link to="/vendor-bills"> &larr; Back to Vendor Bills</Link>
            <h2>Vendor Bill: BILL-{bill.id}</h2>
            
            <div>
                <p><strong>PO ID:</strong> PO-{bill.purchaseOrderId}</p>
                <p><strong>Vendor:</strong> {bill.vendor ? bill.vendor.name : 'N/A'}</p>
                <p><strong>Bill Date:</strong> {bill.billDate}</p>
                <p><strong>Due Date:</strong> {bill.dueDate}</p>
                <p><strong>Status:</strong> {bill.status}</p>
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
                    {bill.items && bill.items.map((item, index) => (
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
                        <td style={{ textAlign: 'right', padding: '8px' }}><strong>{calculateTotal(bill.items).toFixed(2)}</strong></td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default VendorBillDetailPage;
