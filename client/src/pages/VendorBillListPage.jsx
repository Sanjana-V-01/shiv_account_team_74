import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PaymentForm = ({ bill, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        paymentDate: new Date().toISOString().slice(0, 10),
        paymentMethod: 'Cash',
        amount: bill.totalAmount.toFixed(2)
    });

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/api/payments', { ...formData, vendorBillId: bill.id });
            onSave();
        } catch (err) {
            console.error("Error saving payment:", err);
            alert(err.response?.data?.message || "Failed to save payment.");
        }
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
            <h4>Register Payment for BILL-{bill.id}</h4>
            <form onSubmit={onSubmit}>
                <label>Payment Date: </label>
                <input type="date" name="paymentDate" value={formData.paymentDate} onChange={onChange} required />
                <label style={{ marginLeft: '1rem' }}>Amount: </label>
                <input type="number" name="amount" value={formData.amount} onChange={onChange} required step="0.01" />
                <label style={{ marginLeft: '1rem' }}>Method: </label>
                <select name="paymentMethod" value={formData.paymentMethod} onChange={onChange}>
                    <option value="Cash">Cash</option>
                    <option value="Bank">Bank</option>
                </select>
                <button type="submit" style={{ marginLeft: '1rem' }}>Pay</button>
                <button type="button" onClick={onCancel}>Cancel</button>
            </form>
        </div>
    );
};

const VendorBillListPage = () => {
    const [bills, setBills] = useState([]);
    const [payingBill, setPayingBill] = useState(null); // State to track which bill is being paid

    useEffect(() => {
        fetchBills();
    }, []);

    const fetchBills = async () => {
        try {
            const res = await axios.get('http://localhost:3001/api/vendor-bills');
            setBills(res.data);
        } catch (err) {
            console.error("Error fetching vendor bills:", err);
        }
    };

    const handleSavePayment = () => {
        setPayingBill(null); // Hide the form
        fetchBills(); // Refresh the list
    };

    return (
        <div>
            <h2>Vendor Bills</h2>
            {payingBill && <PaymentForm bill={payingBill} onSave={handleSavePayment} onCancel={() => setPayingBill(null)} />}
            <hr />
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid #ddd' }}>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Bill ID</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>PO ID</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Vendor</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Due Date</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Total Amount</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Status</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {bills.map(bill => (
                        <tr key={bill.id} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '8px' }}>BILL-{bill.id}</td>
                            <td style={{ padding: '8px' }}>PO-{bill.purchaseOrderId}</td>
                            <td style={{ padding: '8px' }}>{bill.vendor ? bill.vendor.name : 'N/A'}</td>
                            <td style={{ padding: '8px' }}>{bill.dueDate}</td>
                            <td style={{ padding: '8px' }}>{bill.totalAmount.toFixed(2)}</td>
                            <td style={{ padding: '8px' }}>{bill.status}</td>
                            <td style={{ padding: '8px' }}>
                                {bill.status === 'Open' && (
                                    <button onClick={() => setPayingBill(bill)}>Register Payment</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default VendorBillListPage;