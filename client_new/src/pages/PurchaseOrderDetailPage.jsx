import React, { useState, useEffect } from 'react';
import api from '../api';
import { useParams, Link, useNavigate } from 'react-router-dom';

const PurchaseOrderDetailPage = () => {
    const { id } = useParams(); // Get the ID from the URL
    const navigate = useNavigate(); // For redirection
    const [po, setPo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPurchaseOrder = async () => {
            try {
                const res = await api.get(`/purchase-orders/${id}`);
                setPo(res.data);
            } catch (err) {
                setError('Failed to fetch purchase order.');
                console.error(err);
            }
            setLoading(false);
        };

        fetchPurchaseOrder();
    }, [id]);

    const handleConvertToBill = async () => {
        if (window.confirm("Are you sure you want to convert this Purchase Order to a Bill?")) {
            try {
                await api.post('/vendor-bills', { purchaseOrderId: id });
                alert('Successfully converted to bill!');
                navigate('/vendor-bills');
            } catch (err) {
                console.error("Error converting to bill:", err);
                alert(err.response?.data?.message || "Failed to convert to bill.");
            }
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!po) return <p>Purchase Order not found.</p>;

    const calculateTotal = (items) => {
        if (!items) return 0;
        return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    }

    return (
        <div>
            <Link to="/purchase-orders"> &larr; Back to Purchase Orders</Link>
            <h2>Purchase Order: PO-{po.id}</h2>
            
            <div>
                <p><strong>Vendor:</strong> {po.vendor ? po.vendor.name : 'N/A'}</p>
                <p><strong>Order Date:</strong> {po.orderDate}</p>
                <p><strong>Status:</strong> {po.status}</p>
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
                    {po.items && po.items.map((item, index) => (
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
                        <td style={{ textAlign: 'right', padding: '8px' }}><strong>{calculateTotal(po.items).toFixed(2)}</strong></td>
                    </tr>
                </tfoot>
            </table>

            <div style={{marginTop: '2rem'}}>
                <button onClick={handleConvertToBill} disabled={po.status === 'Billed'}>
                    {po.status === 'Billed' ? 'Already Billed' : 'Convert to Bill'}
                </button>
            </div>
        </div>
    );
};

export default PurchaseOrderDetailPage;
