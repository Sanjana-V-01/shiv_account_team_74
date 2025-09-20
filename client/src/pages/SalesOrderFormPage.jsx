import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SalesOrderFormPage = () => {
    const navigate = useNavigate();
    
    // Data stores
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);

    // Form state
    const [customerId, setCustomerId] = useState('');
    const [orderDate, setOrderDate] = useState(new Date().toISOString().slice(0, 10));
    const [items, setItems] = useState([{
        productId: '',
        quantity: 1,
        unitPrice: 0
    }]);

    // Fetch master data on component mount
    useEffect(() => {
        const fetchMasterData = async () => {
            try {
                const [contactsRes, productsRes] = await Promise.all([
                    axios.get('http://localhost:3001/api/contacts'),
                    axios.get('http://localhost:3001/api/products')
                ]);
                setCustomers(contactsRes.data.filter(c => c.type === 'Customer' || c.type === 'Both'));
                setProducts(productsRes.data);
            } catch (error) {
                console.error("Failed to fetch master data", error);
                alert("Failed to load required data. Please try again.");
            }
        };
        fetchMasterData();
    }, []);

    const handleItemChange = (index, event) => {
        const newItems = [...items];
        const { name, value } = event.target;
        newItems[index][name] = value;

        // If product is changed, update the price
        if (name === 'productId') {
            const product = products.find(p => p.id === parseInt(value));
            newItems[index].unitPrice = product ? product.salesPrice : 0;
        }

        setItems(newItems);
    };

    const handleAddItem = () => {
        setItems([...items, { productId: '', quantity: 1, unitPrice: 0 }]);
    };

    const handleRemoveItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const calculateTotal = () => {
        return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0).toFixed(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!customerId || items.some(item => !item.productId)) {
            alert("Please select a customer and ensure all items have a selected product.");
            return;
        }

        const customer = customers.find(c => c.id === parseInt(customerId));
        const finalItems = items.map(item => ({
            ...item,
            product: products.find(p => p.id === parseInt(item.productId))
        }));

        const salesOrder = {
            customer,
            orderDate,
            items: finalItems,
            totalAmount: calculateTotal(),
            status: 'Draft'
        };

        try {
            await axios.post('http://localhost:3001/api/sales-orders', salesOrder);
            alert('Sales Order created successfully!');
            navigate('/sales-orders');
        } catch (error) {
            console.error("Failed to create sales order", error);
            alert("Failed to create sales order.");
        }
    };

    return (
        <div>
            <h2>New Sales Order</h2>
            <form onSubmit={handleSubmit}>
                {/* Main SO Details */}
                <div>
                    <label>Customer: </label>
                    <select value={customerId} onChange={e => setCustomerId(e.target.value)} required>
                        <option value="">Select a Customer</option>
                        {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div>
                    <label>Order Date: </label>
                    <input type="date" value={orderDate} onChange={e => setOrderDate(e.target.value)} required />
                </div>

                {/* Line Items */}
                <h3 style={{marginTop: '2rem'}}>Items</h3>
                {items.map((item, index) => (
                    <div key={index} style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                        <select name="productId" value={item.productId} onChange={e => handleItemChange(index, e)} required>
                            <option value="">Select a Product</option>
                            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        <input type="number" name="quantity" value={item.quantity} onChange={e => handleItemChange(index, e)} placeholder="Quantity" min="1" style={{width: '80px'}}/>
                        <input type="number" name="unitPrice" value={item.unitPrice} onChange={e => handleItemChange(index, e)} placeholder="Unit Price" step="0.01" style={{width: '100px'}}/>
                        <button type="button" onClick={() => handleRemoveItem(index)}>Remove</button>
                    </div>
                ))}
                <button type="button" onClick={handleAddItem}>+ Add Line</button>

                {/* Total and Save */}
                <hr />
                <h3>Total: {calculateTotal()}</h3>
                <button type="submit">Save Sales Order</button>
            </form>
        </div>
    );
};

export default SalesOrderFormPage;
