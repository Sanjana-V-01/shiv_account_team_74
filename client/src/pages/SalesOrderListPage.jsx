import React, { useState, useEffect } from 'react';
import api from '../api'; // Import the custom axios instance
import { Link } from 'react-router-dom';

const SalesOrderListPage = () => {
    const [salesOrders, setSalesOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSalesOrders();
    }, []);

    const fetchSalesOrders = async () => {
        try {
            const res = await api.get('/sales-orders');
            setSalesOrders(res.data);
        } catch (err) {
            console.error("Error fetching sales orders:", err);
            setError("Failed to load sales orders.");
        }
        setLoading(false);
    };

    const calculateTotal = (items) => {
        if (!items) return 0;
        return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    }

    const handleDelete = async (soId) => {
        console.log('Attempting to delete SO with ID:', soId); // Added for debugging
        if (window.confirm("Are you sure you want to delete this sales order?")) {
            try {
                await api.delete(`/sales-orders/${soId}`);
                fetchSalesOrders(); // Refresh the list
            } catch (err) {
                console.error("Error deleting sales order:", err);
                alert("Failed to delete sales order.");
            }
        }
    };

    if (loading) return <p>Loading sales orders...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h2>Sales Orders</h2>
            <Link to="/sales-orders/new">
                <button>+ New Sales Order</button>
            </Link>
            <hr />
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid #ddd' }}>
                        <th style={{ textAlign: 'left', padding: '8px' }}>ID</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Customer</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Order Date</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Total Amount</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Status</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {salesOrders.length === 0 ? (
                        <tr><td colSpan="6" style={{ textAlign: 'center', padding: '8px' }}>No sales orders found. Please create one.</td></tr>
                    ) : (
                        salesOrders.map(so => (
                            <tr key={so.id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '8px' }}>SO-{so.id}</td>
                                <td style={{ padding: '8px' }}>{so.customer ? so.customer.name : 'N/A'}</td>
                                <td style={{ padding: '8px' }}>{so.orderDate}</td>
                                <td style={{ padding: '8px' }}>{calculateTotal(so.items).toFixed(2)}</td>
                                <td style={{ padding: '8px' }}>{so.status}</td>
                                <td style={{ padding: '8px' }}>
                                    {so.id && (
                                        <Link to={`/sales-orders/${so.id}`}><button>View</button></Link>
                                    )}
                                    <button onClick={() => handleDelete(so.id)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default SalesOrderListPage;