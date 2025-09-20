import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfitLossPage = () => {
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReportData = async () => {
            try {
                const res = await axios.get('http://localhost:3001/api/reports/profit-loss');
                setReportData(res.data);
            } catch (err) {
                console.error("Error fetching P&L data:", err);
                alert("Could not load report data.");
            }
            setLoading(false);
        };

        fetchReportData();
    }, []);

    if (loading) {
        return <p>Generating report...</p>;
    }

    if (!reportData) {
        return <p>Could not load report data.</p>;
    }

    const { totalIncome, totalExpenses, netProfit } = reportData;

    return (
        <div>
            <h2>Profit & Loss Statement</h2>
            <div style={{ border: '1px solid #ccc', padding: '1rem', width: '400px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '0.5rem 0' }}>
                    <span>Total Income (from Invoices)</span>
                    <span>{totalIncome.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #333', padding: '0.5rem 0' }}>
                    <span>Total Expenses (from Bills)</span>
                    <span>({totalExpenses.toFixed(2)})</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', paddingTop: '0.5rem' }}>
                    <span>Net Profit</span>
                    <span>{netProfit.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};

export default ProfitLossPage;
