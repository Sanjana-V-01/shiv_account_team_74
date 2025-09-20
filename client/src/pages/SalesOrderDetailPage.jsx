import React, { useState, useEffect } from 'react';
import api from '../api'; // Import the custom axios instance
import { useParams, Link, useNavigate } from 'react-router-dom';

const SalesOrderDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [so, setSo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSalesOrder = async () => {
            try {
                const res = await api.get(`/sales-orders/${id}`);
                setSo(res.data);
            } catch (err) {
                setError('Failed to fetch sales order.');
                console.error(err);
            }
            setLoading(false);
        };

        fetchSalesOrder();
    }, [id]);

    const handleConvertToInvoice = async () => {
        if (window.confirm("Are you sure you want to convert this Sales Order to an Invoice?")) {
            try {
                await api.post('/customer-invoices', { salesOrderId: id });
                alert('Successfully converted to invoice!');
                navigate('/customer-invoices');
            } catch (err) {
                console.error("Error converting to invoice:", err);
                alert(err.response?.data?.message || "Failed to convert to invoice.");
            }
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!so) return <p>Sales Order not found.</p>;

    const calculateTotal = (items) => {
        if (!items) return 0;
        return items.reduce((sum, item) => sum + (parseFloat(item.quantity) * parseFloat(item.unitPrice || 0)), 0);
    }

    return (
        <div>
            <Link to="/sales-orders"> &larr; Back to Sales Orders</Link>
            <h2>Sales Order: SO-{so.id}</h2>
            
            <div>
                <p><strong>Customer:</strong> {so.customer ? so.customer.name : 'N/A'}</p>
                <p><strong>Order Date:</strong> {so.orderDate}</p>
                <p><strong>Status:</strong> {so.status}</p>
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
                    {so.items && so.items.map((item, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '8px' }}>{item.product ? item.product.name : 'N/A'}</td>
                            <td style={{ textAlign: 'right', padding: '8px' }}>{item.quantity}</td>
                            <td style={{ textAlign: 'right', padding: '8px' }}>{parseFloat(item.unitPrice || 0).toFixed(2)}</td>
                            <td style={{ textAlign: 'right', padding: '8px' }}>{(parseFloat(item.quantity) * parseFloat(item.unitPrice || 0)).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan="3" style={{ textAlign: 'right', padding: '8px' }}><strong>Total:</strong></td>
                        <td style={{ textAlign: 'right', padding: '8px' }}><strong>{calculateTotal(so.items).toFixed(2)}</strong></td>
                    </tr>
                </tfoot>
            </table>

            <div style={{marginTop: '2rem'}}>
                <button onClick={handleConvertToInvoice} disabled={so.status === 'Invoiced'}>
                    {so.status === 'Invoiced' ? 'Already Invoiced' : 'Convert to Invoice'}
                </button>
            </div>
        </div>
    );
};

export default SalesOrderDetailPage;
