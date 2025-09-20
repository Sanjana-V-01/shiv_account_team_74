import React, { useState, useEffect } from 'react';
import api from '../api'; // Import the custom axios instance

const PartnerLedgerPage = () => {
    const [contacts, setContacts] = useState([]);
    const [selectedContactId, setSelectedContactId] = useState('');
    const [ledgerData, setLedgerData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const res = await api.get('/contacts');
                setContacts(res.data);
            } catch (err) {
                console.error("Error fetching contacts:", err);
                setError("Could not load contacts for selection.");
            }
        };
        fetchContacts();
    }, []);

    useEffect(() => {
        if (selectedContactId) {
            fetchLedger(selectedContactId);
        } else {
            setLedgerData(null);
        }
    }, [selectedContactId]);

    const fetchLedger = async (contactId) => {
        setLoading(true);
        setError('');
        try {
            const res = await api.get(`/reports/partner-ledger?contactId=${contactId}`);
            setLedgerData(res.data);
        } catch (err) {
            console.error("Error fetching partner ledger:", err);
            setError(err.response?.data?.message || "Failed to load partner ledger.");
            setLedgerData(null);
        }
        setLoading(false);
    };

    return (
        <div>
            <h2>Partner Ledger</h2>
            <div>
                <label>Select Contact:</label>
                <select value={selectedContactId} onChange={e => setSelectedContactId(e.target.value)}>
                    <option value="">-- Select --</option>
                    {contacts.map(contact => (
                        <option key={contact.id} value={contact.id}>{contact.name} ({contact.type})</option>
                    ))}
                </select>
            </div>

            {loading && <p>Loading ledger...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {ledgerData && ledgerData.ledger.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                    <h3>Ledger for {ledgerData.contact.name}</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #ddd' }}>
                                <th style={{ textAlign: 'left', padding: '8px' }}>Date</th>
                                <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
                                <th style={{ textAlign: 'left', padding: '8px' }}>Ref</th>
                                <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
                                <th style={{ textAlign: 'right', padding: '8px' }}>Debit</th>
                                <th style={{ textAlign: 'right', padding: '8px' }}>Credit</th>
                                <th style={{ textAlign: 'right', padding: '8px' }}>Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ledgerData.ledger.map((entry, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                                    <td style={{ padding: '8px' }}>{entry.date}</td>
                                    <td style={{ padding: '8px' }}>{entry.type}</td>
                                    <td style={{ padding: '8px' }}>{entry.ref}</td>
                                    <td style={{ padding: '8px' }}>{entry.description}</td>
                                    <td style={{ textAlign: 'right', padding: '8px' }}>{parseFloat(entry.debit || 0).toFixed(2)}</td>
                                    <td style={{ textAlign: 'right', padding: '8px' }}>{parseFloat(entry.credit || 0).toFixed(2)}</td>
                                    <td style={{ textAlign: 'right', padding: '8px' }}>{parseFloat(entry.runningBalance || 0).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {ledgerData && ledgerData.ledger.length === 0 && (
                <p style={{ marginTop: '1rem' }}>No transactions found for this contact.</p>
            )}
        </div>
    );
};

export default PartnerLedgerPage;
