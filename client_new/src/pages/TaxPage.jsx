import React, { useState, useEffect } from 'react';
import api from '../api';

const TaxForm = ({ onSave, onCancel, editingTax }) => {
    const [formData, setFormData] = useState({
        name: '',
        computation: 'Percentage',
        applicableOn: 'Sales',
        value: ''
    });

    useEffect(() => {
        if (editingTax) {
            setFormData(editingTax);
        } else {
            setFormData({ name: '', computation: 'Percentage', applicableOn: 'Sales', value: '' });
        }
    }, [editingTax]);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingTax) {
                await api.put(`/taxes/${editingTax.id}`, formData);
            } else {
                await api.post('/taxes', formData);
            }
            onSave();
        } catch (err) {
            console.error("Error saving tax:", err);
            alert("Failed to save tax.");
        }
    };

    return (
        <form onSubmit={onSubmit} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
            <h3>{editingTax ? 'Edit Tax' : 'New Tax'}</h3>
            <input name="name" value={formData.name} onChange={onChange} placeholder="Tax Name (e.g., GST 5%)" required style={{ display: 'block', marginBottom: '0.5rem' }} />
            <select name="computation" value={formData.computation} onChange={onChange} style={{ display: 'block', marginBottom: '0.5rem' }}>
                <option value="Percentage">Percentage</option>
                <option value="Fixed Value">Fixed Value</option>
            </select>
            <select name="applicableOn" value={formData.applicableOn} onChange={onChange} style={{ display: 'block', marginBottom: '0.5rem' }}>
                <option value="Sales">Sales</option>
                <option value="Purchase">Purchase</option>
            </select>
            <input name="value" value={formData.value} onChange={onChange} placeholder="Value" type="number" required style={{ display: 'block', marginBottom: '0.5rem' }} />
            <button type="submit">Save</button>
            <button type="button" onClick={onCancel}>Cancel</button>
        </form>
    );
};

const TaxPage = () => {
    const [taxes, setTaxes] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingTax, setEditingTax] = useState(null);

    useEffect(() => {
        fetchTaxes();
    }, []);

    const fetchTaxes = async () => {
        try {
            const res = await api.get('/taxes');
            setTaxes(res.data);
        } catch (err) {
            console.error("Error fetching taxes:", err);
        }
    };

    const handleSave = () => {
        setShowForm(false);
        setEditingTax(null);
        fetchTaxes();
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingTax(null);
    };

    const handleEdit = (tax) => {
        setEditingTax(tax);
        setShowForm(true);
    };

    const handleDelete = async (taxId) => {
        if (window.confirm("Are you sure you want to delete this tax?")) {
            try {
                await api.delete(`/taxes/${taxId}`);
                fetchTaxes();
            } catch (err) {
                console.error("Error deleting tax:", err);
            }
        }
    };

    const isFormVisible = showForm || editingTax !== null;

    return (
        <div>
            <h2>Taxes Master</h2>
            {!isFormVisible && (
                <button onClick={() => { setEditingTax(null); setShowForm(true); }}>+ New Tax</button>
            )}
            <hr />
            {isFormVisible && <TaxForm onSave={handleSave} onCancel={handleCancel} editingTax={editingTax} />}
            
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid #ddd' }}>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Name</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Computation</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Applicable On</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Value</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {taxes.map(tax => (
                        <tr key={tax.id} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '8px' }}>{tax.name}</td>
                            <td style={{ padding: '8px' }}>{tax.computation}</td>
                            <td style={{ padding: '8px' }}>{tax.applicableOn}</td>
                            <td style={{ padding: '8px' }}>{tax.value}{tax.computation === 'Percentage' ? '%' : ''}</td>
                            <td style={{ padding: '8px' }}>
                                <button onClick={() => handleEdit(tax)}>Edit</button>
                                <button onClick={() => handleDelete(tax.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TaxPage;
