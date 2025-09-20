import React, { useState, useEffect } from 'react';
import api from '../api'; // Import the custom axios instance

const ProductForm = ({ onSave, onCancel, editingProduct }) => {
    const [formData, setFormData] = useState({
        name: '',
        type: 'Goods',
        salesPrice: '',
        purchasePrice: '',
        hsnCode: '',
        currentStock: 0 // Added currentStock field
    });

    useEffect(() => {
        if (editingProduct) {
            setFormData(editingProduct);
        } else {
            setFormData({ name: '', type: 'Goods', salesPrice: '', purchasePrice: '', hsnCode: '', currentStock: 0 });
        }
    }, [editingProduct]);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await api.put(`/products/${editingProduct.id}`, formData);
            } else {
                await api.post('/products', formData);
            }
            onSave();
        } catch (err) {
            console.error("Error saving product:", err);
            alert("Failed to save product.");
        }
    };

    return (
        <form onSubmit={onSubmit} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
            <h3>{editingProduct ? 'Edit Product' : 'New Product'}</h3>
            <input name="name" value={formData.name} onChange={onChange} placeholder="Product Name" required style={{ display: 'block', marginBottom: '0.5rem' }} />
            <select name="type" value={formData.type} onChange={onChange} style={{ display: 'block', marginBottom: '0.5rem' }}>
                <option value="Goods">Goods</option>
                <option value="Service">Service</option>
            </select>
            <input name="salesPrice" value={formData.salesPrice} onChange={onChange} placeholder="Sales Price" type="number" required style={{ display: 'block', marginBottom: '0.5rem' }} />
            <input name="purchasePrice" value={formData.purchasePrice} onChange={onChange} placeholder="Purchase Price" type="number" required style={{ display: 'block', marginBottom: '0.5rem' }} />
            <input name="hsnCode" value={formData.hsnCode} onChange={onChange} placeholder="HSN Code" style={{ display: 'block', marginBottom: '0.5rem' }} />
            <input name="currentStock" value={formData.currentStock} onChange={onChange} placeholder="Current Stock" type="number" style={{ display: 'block', marginBottom: '0.5rem' }} /> {/* Added stock field */}
            <button type="submit">Save</button>
            <button type="button" onClick={onCancel}>Cancel</button>
        </form>
    );
};

const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (err) {
            console.error("Error fetching products:", err);
        }
    };

    const handleSave = () => {
        setShowForm(false);
        setEditingProduct(null);
        fetchProducts();
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingProduct(null);
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    const handleDelete = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await api.delete(`/products/${productId}`);
                fetchProducts();
            } catch (err) {
                console.error("Error deleting product:", err);
            }
        }
    };

    const isFormVisible = showForm || editingProduct !== null;

    return (
        <div>
            <h2>Product Master</h2>
            {!isFormVisible && (
                <button onClick={() => { setEditingProduct(null); setShowForm(true); }}>+ New Product</button>
            )}
            <hr />
            {isFormVisible && <ProductForm onSave={handleSave} onCancel={handleCancel} editingProduct={editingProduct} />}
            
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid #ddd' }}>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Name</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Sales Price</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Purchase Price</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Current Stock</th> {/* Added stock header */}
                        <th style={{ textAlign: 'left', padding: '8px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '8px' }}>{product.name}</td>
                            <td style={{ padding: '8px' }}>{product.type}</td>
                            <td style={{ padding: '8px' }}>{product.salesPrice}</td>
                            <td style={{ padding: '8px' }}>{product.purchasePrice}</td>
                            <td style={{ padding: '8px' }}>{product.currentStock}</td> {/* Display stock */}
                            <td style={{ padding: '8px' }}>
                                <button onClick={() => handleEdit(product)}>Edit</button>
                                <button onClick={() => handleDelete(product.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductPage;
