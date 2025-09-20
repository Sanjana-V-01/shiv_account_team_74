import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StockAccountPage = () => {
    const [stockData, setStockData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStockData = async () => {
            try {
                const res = await axios.get('http://localhost:3001/api/reports/stock-account');
                setStockData(res.data);
            } catch (err) {
                console.error("Error fetching Stock Account data:", err);
                alert("Could not load stock report data.");
            }
            setLoading(false);
        };

        fetchStockData();
    }, []);

    if (loading) {
        return <p>Generating stock report...</p>;
    }

    if (!stockData || stockData.length === 0) {
        return <p>No stock data available. Please add products and transactions.</p>;
    }

    return (
        <div>
            <h2>Stock Account / Inventory Report</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid #ddd' }}>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Product Name</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
                        <th style={{ textAlign: 'right', padding: '8px' }}>Current Stock</th>
                    </tr>
                </thead>
                <tbody>
                    {stockData.map(product => (
                        <tr key={product.id} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '8px' }}>{product.name}</td>
                            <td style={{ padding: '8px' }}>{product.type}</td>
                            <td style={{ textAlign: 'right', padding: '8px' }}>{product.currentStock}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StockAccountPage;
