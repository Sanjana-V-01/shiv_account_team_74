import React, { useState, useEffect } from 'react';
import api from '../api';

const BalanceSheetPage = () => {
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReportData = async () => {
            try {
                const res = await api.get('/reports/balance-sheet');
                setReportData(res.data);
            } catch (err) {
                console.error("Error fetching Balance Sheet data:", err);
                alert("Could not load report data.");
            }
            setLoading(false);
        };

        fetchReportData();
    }, []);

    if (loading) {
        return <p>Generating Balance Sheet...</p>;
    }

    if (!reportData) {
        return <p>Could not load report data.</p>;
    }

    const { assets, liabilities, equity } = reportData;

    return (
        <div>
            <h2>Balance Sheet</h2>
            <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
                {/* Assets */}
                <div style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem', flex: 1 }}>
                    <h3>Assets</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0' }}>
                        <span>Cash & Bank:</span>
                        <span>{assets.cashAndBank.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0' }}>
                        <span>Accounts Receivable:</span>
                        <span>{assets.accountsReceivable.toFixed(2)}</span>
                    </div>
                    <hr />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', padding: '0.3rem 0' }}>
                        <span>Total Assets:</span>
                        <span>{assets.total.toFixed(2)}</span>
                    </div>
                </div>

                {/* Liabilities & Equity */}
                <div style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem', flex: 1 }}>
                    <h3>Liabilities</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0' }}>
                        <span>Accounts Payable:</span>
                        <span>{liabilities.accountsPayable.toFixed(2)}</span>
                    </div>
                    <hr />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', padding: '0.3rem 0' }}>
                        <span>Total Liabilities:</span>
                        <span>{liabilities.total.toFixed(2)}</span>
                    </div>

                    <h3 style={{marginTop: '1rem'}}>Equity</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0' }}>
                        <span>Retained Earnings:</span>
                        <span>{equity.retainedEarnings.toFixed(2)}</span>
                    </div>
                    <hr />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', padding: '0.3rem 0' }}>
                        <span>Total Equity:</span>
                        <span>{equity.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', marginTop: '1rem' }}>
                <div style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem', flex: 1, textAlign: 'center', fontWeight: 'bold' }}>
                    Total Liabilities & Equity: {(liabilities.total + equity.total).toFixed(2)}
                </div>
            </div>
        </div>
    );
};

export default BalanceSheetPage;
