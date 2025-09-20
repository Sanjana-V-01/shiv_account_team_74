import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PurchaseOrderListPage = () => {
    const [purchaseOrders, setPurchaseOrders] = useState([]);

    useEffect(() => {
        fetchPurchaseOrders();
    }, []);

    const fetchPurchaseOrders = async () => {
        try {
            const res = await axios.get('http://localhost:3001/api/purchase-orders');
            setPurchaseOrders(res.data);
        } catch (err) {
            console.error("Error fetching purchase orders:", err);
        }
    };

    const calculateTotal = (items) => {
        if (!items) return 0;
        return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    }

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
                    {purchaseOrders.map(po => (
                        <tr key={po.id} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '8px' }}>PO-{po.id}</td>
                            <td style={{ padding: '8px' }}>{po.vendor ? po.vendor.name : 'N/A'}</td>
                            <td style={{ padding: '8px' }}>{po.orderDate}</td>
                            <td style={{ padding: '8px' }}>{calculateTotal(po.items).toFixed(2)}</td>
                            <td style={{ padding: '8px' }}>{po.status}</td>
                            <td style={{ padding: '8px' }}>
                                <Link to={`/purchase-orders/${po.id}`}><button>View</button></Link>
                                <button>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PurchaseOrderListPage;
