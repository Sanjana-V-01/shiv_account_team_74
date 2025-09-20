import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AccountForm = ({ onSave, onCancel, editingAccount }) => {
    const [formData, setFormData] = useState({
        name: '',
        type: 'Asset'
    });

    useEffect(() => {
        if (editingAccount) {
            setFormData(editingAccount);
        } else {
            setFormData({ name: '', type: 'Asset' });
        }
    }, [editingAccount]);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingAccount) {
                await axios.put(`http://localhost:3001/api/accounts/${editingAccount.id}`, formData);
            } else {
                await axios.post('http://localhost:3001/api/accounts', formData);
            }
            onSave();
        } catch (err) {
            console.error("Error saving account:", err);
            alert("Failed to save account.");
        }
    };

    return (
        <form onSubmit={onSubmit} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
            <h3>{editingAccount ? 'Edit Account' : 'New Account'}</h3>
            <input name="name" value={formData.name} onChange={onChange} placeholder="Account Name" required style={{ display: 'block', marginBottom: '0.5rem' }} />
            <select name="type" value={formData.type} onChange={onChange} style={{ display: 'block', marginBottom: '0.5rem' }}>
                <option value="Asset">Asset</option>
                <option value="Liability">Liability</option>
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
                <option value="Equity">Equity</option>
            </select>
            <button type="submit">Save</button>
            <button type="button" onClick={onCancel}>Cancel</button>
        </form>
    );
};

const AccountPage = () => {
    const [accounts, setAccounts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingAccount, setEditingAccount] = useState(null);

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const res = await axios.get('http://localhost:3001/api/accounts');
            setAccounts(res.data);
        } catch (err) {
            console.error("Error fetching accounts:", err);
        }
    };

    const handleSave = () => {
        setShowForm(false);
        setEditingAccount(null);
        fetchAccounts();
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingAccount(null);
    };

    const handleEdit = (account) => {
        setEditingAccount(account);
        setShowForm(true);
    };

    const handleDelete = async (accountId) => {
        if (window.confirm("Are you sure you want to delete this account?")) {
            try {
                await axios.delete(`http://localhost:3001/api/accounts/${accountId}`);
                fetchAccounts();
            } catch (err) {
                console.error("Error deleting account:", err);
            }
        }
    };

    const isFormVisible = showForm || editingAccount !== null;

    return (
        <div>
            <h2>Chart of Accounts</h2>
            {!isFormVisible && (
                <button onClick={() => { setEditingAccount(null); setShowForm(true); }}>+ New Account</button>
            )}
            <hr />
            {isFormVisible && <AccountForm onSave={handleSave} onCancel={handleCancel} editingAccount={editingAccount} />}
            
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid #ddd' }}>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Account Name</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {accounts.map(account => (
                        <tr key={account.id} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '8px' }}>{account.name}</td>
                            <td style={{ padding: '8px' }}>{account.type}</td>
                            <td style={{ padding: '8px' }}>
                                <button onClick={() => handleEdit(account)}>Edit</button>
                                <button onClick={() => handleDelete(account.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AccountPage;
