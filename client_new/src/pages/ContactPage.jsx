import React, { useState, useEffect } from 'react';
import api from '../api';

const ContactForm = ({ onSave, onCancel, editingContact }) => {
    const [formData, setFormData] = useState({
        name: '',
        type: 'Customer', // Default value
        email: '',
        phone: '',
        address: '',
        profileImage: null // To store the file object
    });
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (editingContact) {
            setFormData(editingContact);
            setImagePreview(editingContact.profileImage ? `http://localhost:3001${editingContact.profileImage}` : null);
        } else {
            setFormData({ name: '', type: 'Customer', email: '', phone: '', address: '', profileImage: null });
            setImagePreview(null);
        }
    }, [editingContact]);

    const onChange = e => {
        if (e.target.name === 'profileImage') {
            const file = e.target.files[0];
            setFormData({ ...formData, profileImage: file });
            if (file) {
                setImagePreview(URL.createObjectURL(file));
            } else {
                setImagePreview(null);
            }
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        for (const key in formData) {
            if (key === 'profileImage' && formData[key] === null && editingContact && editingContact.profileImage) {
                // If image was removed, send a special value
                data.append(key, 'null');
            } else if (key === 'profileImage' && formData[key] instanceof File) {
                data.append(key, formData[key]);
            } else if (key !== 'profileImage') {
                data.append(key, formData[key]);
            }
        }

        try {
            if (editingContact) {
                await api.put(`/contacts/${editingContact.id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/contacts', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            onSave();
        } catch (err) {
            console.error("Error saving contact:", err);
            alert("Failed to save contact.");
        }
    };

    return (
        <form onSubmit={onSubmit} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
            <h3>{editingContact ? 'Edit Contact' : 'New Contact'}</h3>
            <input name="name" value={formData.name} onChange={onChange} placeholder="Contact Name" required style={{ display: 'block', marginBottom: '0.5rem' }} />
            <select name="type" value={formData.type} onChange={onChange} style={{ display: 'block', marginBottom: '0.5rem' }}>
                <option value="Customer">Customer</option>
                <option value="Vendor">Vendor</option>
                <option value="Both">Both</option>
            </select>
            <input name="email" value={formData.email} onChange={onChange} placeholder="Email" type="email" required style={{ display: 'block', marginBottom: '0.5rem' }} />
            <input name="phone" value={formData.phone} onChange={onChange} placeholder="Phone" style={{ display: 'block', marginBottom: '0.5rem' }} />
            <input name="address" value={formData.address} onChange={onChange} placeholder="Address" style={{ display: 'block', marginBottom: '0.5rem' }} />
            
            <div>
                <label>Profile Image:</label>
                <input type="file" name="profileImage" accept="image/*" onChange={onChange} />
                {imagePreview && (
                    <img src={imagePreview} alt="Profile Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '0.5rem' }} />
                )}
                {editingContact && editingContact.profileImage && !formData.profileImage && (
                    <button type="button" onClick={() => { setFormData({ ...formData, profileImage: null }); setImagePreview(null); }}>Remove Current Image</button>
                )}
            </div>

            <button type="submit">Save</button>
            <button type="button" onClick={onCancel}>Cancel</button>
        </form>
    );
};

const ContactPage = () => {
    const [contacts, setContacts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingContact, setEditingContact] = useState(null);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const res = await api.get('/contacts');
            setContacts(res.data);
        } catch (err) {
            console.error("Error fetching contacts:", err);
            alert("Could not fetch contacts.");
        }
    };

    const handleSave = () => {
        setShowForm(false);
        setEditingContact(null);
        fetchContacts();
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingContact(null);
    };

    const handleEdit = (contact) => {
        setEditingContact(contact);
        setShowForm(true);
    };

    const handleDelete = async (contactId) => {
        if (window.confirm("Are you sure you want to delete this contact?")) {
            try {
                await api.delete(`/contacts/${contactId}`);
                fetchContacts(); // Refresh the list
            } catch (err) {
                console.error("Error deleting contact:", err);
                alert("Failed to delete contact.");
            }
        }
    };

    const isFormVisible = showForm || editingContact !== null;

    return (
        <div>
            <h2>Contact Master</h2>
            {!isFormVisible && (
                <button onClick={() => { setEditingContact(null); setShowForm(true); }}>+ New Contact</button>
            )}
            <hr />
            {isFormVisible && <ContactForm onSave={handleSave} onCancel={handleCancel} editingContact={editingContact} />}
            
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid #ddd' }}>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Image</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Name</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Email</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Phone</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {contacts.map(contact => (
                        <tr key={contact.id} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '8px' }}>
                                {contact.profileImage && (
                                    <img src={`http://localhost:3001${contact.profileImage}`} alt="Profile" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '50%' }} />
                                )}
                            </td>
                            <td style={{ padding: '8px' }}>{contact.name}</td>
                            <td style={{ padding: '8px' }}>{contact.type}</td>
                            <td style={{ padding: '8px' }}>{contact.email}</td>
                            <td style={{ padding: '8px' }}>{contact.phone}</td>
                            <td style={{ padding: '8px' }}>
                                <button onClick={() => handleEdit(contact)}>Edit</button>
                                <button onClick={() => handleDelete(contact.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ContactPage;
