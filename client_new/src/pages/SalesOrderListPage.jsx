import React, { useState, useEffect } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';

const SalesOrderListPage = () => {
    const [salesOrders, setSalesOrders] = useState([]);

    useEffect(() => {
        fetchSalesOrders();
    }, []);

    const fetchSalesOrders = async () => {
        try {
            const res = await api.get('/sales-orders');
            setSalesOrders(res.data);
        } catch (err) {
            console.error("Error fetching sales orders:", err);
        }
    };

    const calculateTotal = (items) => {
        if (!items) return 0;
        return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    }

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
                    {salesOrders.map(so => (
                        <tr key={so.id} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '8px' }}>SO-{so.id}</td>
                            <td style={{ padding: '8px' }}>{so.customer ? so.customer.name : 'N/A'}</td>
                            <td style={{ padding: '8px' }}>{so.orderDate}</td>
                            <td style={{ padding: '8px' }}>{calculateTotal(so.items).toFixed(2)}</td>
                            <td style={{ padding: '8px' }}>{so.status}</td>
                            <td style={{ padding: '8px' }}>
                                <Link to={`/sales-orders/${so.id}`}><button>View</button></Link>
                                <button>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SalesOrderListPage;
