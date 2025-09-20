import React, { useState, useEffect } from 'react';
import api from '../api'; // Import the custom axios instance
import { useParams, useNavigate } from 'react-router-dom';

const PurchaseOrderDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [purchaseOrder, setPurchaseOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPurchaseOrder = async () => {
            try {
                const res = await api.get(`/purchase-orders/${id}`);
                setPurchaseOrder(res.data);
            } catch (err) {
                console.error("Error fetching purchase order:", err);
                setError("Failed to load purchase order.");
            }
            setLoading(false);
        };
        fetchPurchaseOrder();
    }, [id]);

    const handleCreateBill = async () => {
        if (window.confirm("Are you sure you want to create a Vendor Bill for this Purchase Order?")) {
            try {
                await api.post('/vendor-bills', { purchaseOrderId: id });
                alert("Vendor Bill created successfully!");
                navigate('/vendor-bills'); // Navigate to vendor bills list
            } catch (err) {
                console.error("Error creating vendor bill:", err);
                alert(err.response?.data?.message || "Failed to create Vendor Bill.");
            }
        }
    };

    if (loading) return <p>Loading purchase order details...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!purchaseOrder) return <p>Purchase Order not found.</p>;

    return (
        <div>
            <h2>Purchase Order Details (PO-{purchaseOrder.id})</h2>
            <p><strong>Vendor:</strong> {purchaseOrder.vendor?.name}</p>
            <p><strong>Order Date:</strong> {purchaseOrder.orderDate}</p>
            <p><strong>Status:</strong> {purchaseOrder.status}</p>

            <h3>Items:</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid #ddd' }}>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Product</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Quantity</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Unit Price</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {purchaseOrder.items.map((item, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '8px' }}>{item.product?.name}</td>
                            <td style={{ padding: '8px' }}>{item.quantity}</td>
                            <td style={{ padding: '8px' }}>{item.unitPrice}</td>
                            <td style={{ padding: '8px' }}>{(item.quantity * item.unitPrice).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>Total Amount: {purchaseOrder.totalAmount}</h3>

            {purchaseOrder.status !== 'Billed' && (
                <button onClick={handleCreateBill}>Create Vendor Bill</button>
            )}
            <button onClick={() => navigate('/purchase-orders')}>Back to List</button>
        </div>
    );
};

export default PurchaseOrderDetailPage;
