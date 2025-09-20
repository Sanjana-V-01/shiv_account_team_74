import React, { useState, useEffect } from 'react';
import api from '../api'; // Import the custom axios instance
import { useNavigate } from 'react-router-dom';

const PurchaseOrderFormPage = () => {
    const navigate = useNavigate();
    
    // Data stores
    const [vendors, setVendors] = useState([]);
    const [products, setProducts] = useState([]);

    // Form state
    const [vendorId, setVendorId] = useState('');
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
                    api.get('/contacts'),
                    api.get('/products')
                ]);
                setVendors(contactsRes.data.filter(c => c.type === 'Vendor' || c.type === 'Both'));
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
            const product = products.find(p => p.id === value); // Compare with string ID
            newItems[index].unitPrice = product ? product.purchasePrice : 0;
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
        if (!vendorId || items.some(item => !item.productId)) {
            alert("Please select a vendor and ensure all items have a selected product.");
            return;
        }

        const vendor = vendors.find(v => v.id === vendorId); // Compare with string ID
        const finalItems = items.map(item => ({
            ...item,
            product: products.find(p => p.id === item.productId) // Compare with string ID
        }));

        const purchaseOrder = {
            vendor,
            orderDate,
            items: finalItems,
            totalAmount: calculateTotal(),
            status: 'Draft'
        };

        try {
            await api.post('/purchase-orders', purchaseOrder);
            alert('Purchase Order created successfully!');
            navigate('/purchase-orders');
        } catch (error) {
            console.error("Failed to create purchase order", error);
            alert("Failed to create purchase order.");
        }
    };

    return (
        <div>
            <h2>New Purchase Order</h2>
            <form onSubmit={handleSubmit}>
                {/* Main PO Details */}
                <div>
                    <label>Vendor: </label>
                    <select value={vendorId} onChange={e => setVendorId(e.target.value)} required>
                        <option value="">Select a Vendor</option>
                        {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
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
                <button type="submit">Save Purchase Order</button>
            </form>
        </div>
    );
};

export default PurchaseOrderFormPage;