import React, { useState, useEffect } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
    const [summaryData, setSummaryData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSummaryData = async () => {
            try {
                const res = await api.get('/reports/dashboard-summary');
                setSummaryData(res.data);
            } catch (err) {
                console.error("Error fetching dashboard summary:", err);
                setError("Could not load dashboard data. Please try again.");
            }
            setLoading(false);
        };

        fetchSummaryData();
    }, []);

    const StatCard = ({ title, data, icon, color, gradient }) => (
        <div 
            className="dashboard-stat-card"
            style={{
                ...styles.statCard,
                background: gradient || `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`
            }}
        >
            <div style={styles.cardHeader}>
                <div style={styles.cardIcon} className="dashboard-icon">{icon}</div>
                <h3 style={styles.cardTitle}>{title}</h3>
            </div>
            <div style={styles.cardContent}>
                <div style={styles.statRow}>
                    <span style={styles.statLabel}>Last 24hr</span>
                    <span style={styles.statValue}>₹{data.last24hr.toFixed(2)}</span>
                </div>
                <div style={styles.statRow}>
                    <span style={styles.statLabel}>Last 7 days</span>
                    <span style={styles.statValue}>₹{data.last7days.toFixed(2)}</span>
                </div>
                <div style={styles.statRow}>
                    <span style={styles.statLabel}>Last 30 days</span>
                    <span style={styles.statValue}>₹{data.last30days.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );

    const QuickActionCard = ({ title, description, icon, link, color }) => (
        <Link to={link} style={styles.quickActionLink}>
            <div 
                className="dashboard-quick-action"
                style={{
                    ...styles.quickActionCard,
                    borderLeft: `4px solid ${color}`
                }}
            >
                <div style={styles.quickActionIcon}>{icon}</div>
                <div style={styles.quickActionContent}>
                    <h4 style={styles.quickActionTitle}>{title}</h4>
                    <p style={styles.quickActionDescription}>{description}</p>
                </div>
                <div style={styles.quickActionArrow} className="dashboard-arrow">→</div>
            </div>
        </Link>
    );

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.loadingSpinner}>⏳</div>
                <p style={styles.loadingText}>Loading dashboard data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.errorContainer}>
                <div style={styles.errorIcon}>⚠️</div>
                <p style={styles.errorText}>{error}</p>
                <button 
                    onClick={() => window.location.reload()} 
                    style={styles.retryButton}
                >
                    🔄 Retry
                </button>
            </div>
        );
    }

    if (!summaryData) {
        return (
            <div style={styles.errorContainer}>
                <div style={styles.errorIcon}>📊</div>
                <p style={styles.errorText}>No data available</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Header Section */}
            <div style={styles.header}>
                <div style={styles.headerContent}>
                    <div style={styles.welcomeSection}>
                        <h1 style={styles.welcomeTitle}>Welcome to Shiv Accounts</h1>
                        <p style={styles.welcomeSubtitle}>
                            Your financial dashboard • {new Date().toLocaleDateString('en-IN', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}
                        </p>
                    </div>
                    <div style={styles.headerActions}>
                        <button style={styles.refreshButton} onClick={() => window.location.reload()}>
                            🔄 Refresh
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards Section */}
            <div style={styles.statsSection}>
                <h2 style={styles.sectionTitle}>Financial Overview</h2>
                <div style={styles.statsGrid}>
                    <StatCard 
                        title="Total Invoices" 
                        data={summaryData.totalInvoices}
                        icon="📄"
                        gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    />
                    <StatCard 
                        title="Total Purchases" 
                        data={summaryData.totalPurchases}
                        icon="🛒"
                        gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                    />
                    <StatCard 
                        title="Total Payments" 
                        data={summaryData.totalPayments}
                        icon="💳"
                        gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                    />
                    <StatCard 
                        title="Total Receipts" 
                        data={summaryData.totalReceipts}
                        icon="💰"
                        gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
                    />
                </div>
            </div>

            {/* Quick Actions Section */}
            <div style={styles.quickActionsSection}>
                <h2 style={styles.sectionTitle}>Quick Actions</h2>
                <div style={styles.quickActionsGrid}>
                    <QuickActionCard
                        title="Create Sales Order"
                        description="Record a new customer order"
                        icon="📋"
                        link="/sales-orders/new"
                        color="#667eea"
                    />
                    <QuickActionCard
                        title="Create Purchase Order"
                        description="Order from suppliers"
                        icon="📦"
                        link="/purchase-orders/new"
                        color="#f093fb"
                    />
                    <QuickActionCard
                        title="Add Contact"
                        description="Add customer or vendor"
                        icon="👥"
                        link="/contacts"
                        color="#4facfe"
                    />
                    <QuickActionCard
                        title="Add Product"
                        description="Add new product to catalog"
                        icon="📦"
                        link="/products"
                        color="#43e97b"
                    />
                </div>
            </div>

            {/* Reports Section */}
            <div style={styles.reportsSection}>
                <h2 style={styles.sectionTitle}>Reports & Analytics</h2>
                <div style={styles.reportsGrid}>
                    <Link to="/reports/profit-loss" style={styles.reportCard}>
                        <div style={styles.reportIcon}>📊</div>
                        <h3 style={styles.reportTitle}>Profit & Loss</h3>
                        <p style={styles.reportDescription}>View your financial performance</p>
                    </Link>
                    <Link to="/reports/balance-sheet" style={styles.reportCard}>
                        <div style={styles.reportIcon}>⚖️</div>
                        <h3 style={styles.reportTitle}>Balance Sheet</h3>
                        <p style={styles.reportDescription}>Assets, liabilities & equity</p>
                    </Link>
                    <Link to="/reports/stock-account" style={styles.reportCard}>
                        <div style={styles.reportIcon}>📦</div>
                        <h3 style={styles.reportTitle}>Stock Account</h3>
                        <p style={styles.reportDescription}>Inventory levels & tracking</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        gap: '20px'
    },
    loadingSpinner: {
        fontSize: '48px',
        animation: 'spin 1s linear infinite'
    },
    loadingText: {
        fontSize: '18px',
        color: '#666',
        margin: '0'
    },
    errorContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        gap: '20px',
        textAlign: 'center'
    },
    errorIcon: {
        fontSize: '48px'
    },
    errorText: {
        fontSize: '18px',
        color: '#e53e3e',
        margin: '0'
    },
    retryButton: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '8px',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
    },
    header: {
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        marginBottom: '30px',
        overflow: 'hidden'
    },
    headerContent: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '30px'
    },
    welcomeSection: {
        flex: 1
    },
    welcomeTitle: {
        fontSize: '32px',
        fontWeight: '700',
        color: '#2d3748',
        margin: '0 0 8px 0'
    },
    welcomeSubtitle: {
        fontSize: '16px',
        color: '#718096',
        margin: '0'
    },
    headerActions: {
        display: 'flex',
        gap: '12px'
    },
    refreshButton: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        padding: '12px 20px',
        borderRadius: '8px',
        fontSize: '14px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    statsSection: {
        marginBottom: '40px'
    },
    sectionTitle: {
        fontSize: '24px',
        fontWeight: '600',
        color: '#2d3748',
        margin: '0 0 20px 0'
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px'
    },
    statCard: {
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
    },
    cardHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '20px'
    },
    cardIcon: {
        fontSize: '24px',
        background: 'rgba(255,255,255,0.2)',
        padding: '8px',
        borderRadius: '8px'
    },
    cardTitle: {
        fontSize: '18px',
        fontWeight: '600',
        margin: '0'
    },
    cardContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    statRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    statLabel: {
        fontSize: '14px',
        opacity: '0.9'
    },
    statValue: {
        fontSize: '16px',
        fontWeight: '600'
    },
    quickActionsSection: {
        marginBottom: '40px'
    },
    quickActionsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '16px'
    },
    quickActionLink: {
        textDecoration: 'none',
        color: 'inherit'
    },
    quickActionCard: {
        background: 'white',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        transition: 'all 0.2s ease',
        cursor: 'pointer'
    },
    quickActionIcon: {
        fontSize: '24px',
        background: '#f7fafc',
        padding: '12px',
        borderRadius: '8px'
    },
    quickActionContent: {
        flex: 1
    },
    quickActionTitle: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#2d3748',
        margin: '0 0 4px 0'
    },
    quickActionDescription: {
        fontSize: '14px',
        color: '#718096',
        margin: '0'
    },
    quickActionArrow: {
        fontSize: '20px',
        color: '#cbd5e0',
        transition: 'all 0.2s ease'
    },
    reportsSection: {
        marginBottom: '40px'
    },
    reportsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px'
    },
    reportCard: {
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'all 0.2s ease',
        textAlign: 'center'
    },
    reportIcon: {
        fontSize: '32px',
        marginBottom: '16px'
    },
    reportTitle: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#2d3748',
        margin: '0 0 8px 0'
    },
    reportDescription: {
        fontSize: '14px',
        color: '#718096',
        margin: '0'
    }
};

export default DashboardPage;