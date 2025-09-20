import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DashboardPage = () => {
    const [summaryData, setSummaryData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummaryData = async () => {
            try {
                const res = await axios.get('http://localhost:3001/api/reports/dashboard-summary');
                setSummaryData(res.data);
            } catch (err) {
                console.error("Error fetching dashboard summary:", err);
                alert("Could not load dashboard data.");
            }
            setLoading(false);
        };

        fetchSummaryData();
    }, []);

    if (loading) {
        return <p>Loading dashboard data...</p>;
    }

    if (!summaryData) {
        return <p>Could not load dashboard data.</p>;
    }

    const Card = ({ title, data }) => (
        <div style={{ border: '1px solid #ccc', padding: '1rem', margin: '0.5rem', flex: 1, minWidth: '200px' }}>
            <h3>{title}</h3>
            <p>Last 24hr: {data.last24hr.toFixed(2)}</p>
            <p>Last 7 days: {data.last7days.toFixed(2)}</p>
            <p>Last 30 days: {data.last30days.toFixed(2)}</p>
        </div>
    );

    return (
        <div>
            <h1>Welcome to Shiv Accounts</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                <Card title="Total Invoices" data={summaryData.totalInvoices} />
                <Card title="Total Purchases" data={summaryData.totalPurchases} />
                <Card title="Total Payments" data={summaryData.totalPayments} />
                <Card title="Total Receipts" data={summaryData.totalReceipts} />
            </div>
        </div>
    );
};

export default DashboardPage;