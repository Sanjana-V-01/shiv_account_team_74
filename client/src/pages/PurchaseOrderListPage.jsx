import React, { useState, useEffect } from 'react';
import api from '../api'; // Import the custom axios instance
import { Link } from 'react-router-dom';

const PurchaseOrderListPage = () => {
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPurchaseOrders();
    }, []);

    const fetchPurchaseOrders = async () => {
        try {
            const res = await api.get('/purchase-orders');
            setPurchaseOrders(res.data);
        } catch (err) {
            console.error("Error fetching purchase orders:", err);
            setError("Failed to load purchase orders.");
        }
        setLoading(false);
    };

    const calculateTotal = (items) => {
        if (!items) return 0;
        return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    }

    const handleDelete = async (poId) => {
        console.log('Attempting to delete PO with ID:', poId); // Added for debugging
        if (window.confirm("Are you sure you want to delete this purchase order?")) {
            try {
                await api.delete(`/purchase-orders/${poId}`);
                fetchPurchaseOrders(); // Refresh the list
            } catch (err) {
                console.error("Error deleting purchase order:", err);
                alert("Failed to delete purchase order.");
            }
        }
    };

    if (loading) return <p>Loading purchase orders...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h2>Purchase Orders</h2>
            <Link to="/purchase-orders/new">
                <button>+ New Purchase Order</button>
            </Link>
            <hr />
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid #ddd' }}>
                        <th style={{ textAlign: 'left', padding: '8px' }}>ID</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Vendor</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Order Date</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Total Amount</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Status</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {purchaseOrders.length === 0 ? (
                        <tr><td colSpan="6" style={{ textAlign: 'center', padding: '8px' }}>No purchase orders found. Please create one.</td></tr>
                    ) : (
                        purchaseOrders.map(po => (
                            <tr key={po.id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '8px' }}>PO-{po.id}</td>
                                <td style={{ padding: '8px' }}>{po.vendor ? po.vendor.name : 'N/A'}</td>
                                <td style={{ padding: '8px' }}>{po.orderDate}</td>
                                <td style={{ padding: '8px' }}>{calculateTotal(po.items).toFixed(2)}</td>
                                <td style={{ padding: '8px' }}>{po.status}</td>
                                <td style={{ padding: '8px' }}>
                                    {po.id && (
                                        <Link to={`/purchase-orders/${po.id}`}><button>View</button></Link>
                                    )}
                                    <button onClick={() => handleDelete(po.id)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default PurchaseOrderListPage;