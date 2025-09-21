import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ContactPage from './pages/ContactPage';
import ProductPage from './pages/ProductPage';
import TaxPage from './pages/TaxPage';
import AccountPage from './pages/AccountPage';
import PurchaseOrderListPage from './pages/PurchaseOrderListPage';
import PurchaseOrderFormPage from './pages/PurchaseOrderFormPage';
import PurchaseOrderDetailPage from './pages/PurchaseOrderDetailPage';
import VendorBillListPage from './pages/VendorBillListPage';
import VendorBillDetailPage from './pages/VendorBillDetailPage';
import SalesOrderListPage from './pages/SalesOrderListPage';
import SalesOrderFormPage from './pages/SalesOrderFormPage';
import SalesOrderDetailPage from './pages/SalesOrderDetailPage';
import CustomerInvoiceListPage from './pages/CustomerInvoiceListPage';
import CustomerInvoiceDetailPage from './pages/CustomerInvoiceDetailPage';
import ProfitLossPage from './pages/ProfitLossPage';
import StockAccountPage from './pages/StockAccountPage';
import BalanceSheetPage from './pages/BalanceSheetPage';
import PartnerLedgerPage from './pages/PartnerLedgerPage';
import CustomerPortalPage from './pages/CustomerPortalPage';
import TestSignup from './TestSignup';
import './App.css';
import './auth-animations.css';

// A simple check to see if the user is logged in
const isLoggedIn = () => !!localStorage.getItem('token');

const MainLayout = ({ children }) => (
    <div style={styles.layout}>
        <nav style={styles.navbar} className="navbar">
            <div style={styles.navContent} className="nav-content">
                {/* Logo Section */}
                <div style={styles.logoSection}>
                    <Link to="/dashboard" style={styles.logoLink} className="logo-link">
                        <span style={styles.logoIcon}>📊</span>
                        <span style={styles.logoText}>Shiv Accounts</span>
                    </Link>
                </div>

                {/* Navigation Menu */}
                <div style={styles.navMenu} className="nav-menu">
                    {/* Dashboard */}
                    <div style={styles.navGroup}>
                        <Link to="/dashboard" style={styles.navLink} className="nav-link">
                            <span style={styles.navIcon}>🏠</span>
                            Dashboard
                        </Link>
                    </div>

                    {/* Purchase Section */}
                    <div style={styles.navGroup}>
                        <span style={styles.navGroupTitle}>Purchase</span>
                        <div style={styles.navSubmenu} className="nav-submenu">
                            <Link to="/purchase-orders" style={styles.navSubLink} className="nav-sub-link">
                                <span style={styles.navIcon}>📋</span>
                                Order
                            </Link>
                            <Link to="/vendor-bills" style={styles.navSubLink} className="nav-sub-link">
                                <span style={styles.navIcon}>🧾</span>
                                Bill
                            </Link>
                            <Link to="#" style={styles.navSubLink} className="nav-sub-link">
                                <span style={styles.navIcon}>💳</span>
                                Payment
                            </Link>
                        </div>
                    </div>

                    {/* Sale Section */}
                    <div style={styles.navGroup}>
                        <span style={styles.navGroupTitle}>Sale</span>
                        <div style={styles.navSubmenu} className="nav-submenu">
                            <Link to="/sales-orders" style={styles.navSubLink} className="nav-sub-link">
                                <span style={styles.navIcon}>📋</span>
                                Order
                            </Link>
                            <Link to="/customer-invoices" style={styles.navSubLink} className="nav-sub-link">
                                <span style={styles.navIcon}>🧾</span>
                                Invoice
                            </Link>
                            <Link to="#" style={styles.navSubLink} className="nav-sub-link">
                                <span style={styles.navIcon}>💰</span>
                                Receipt
                            </Link>
                        </div>
                    </div>

                    {/* Reports Section */}
                    <div style={styles.navGroup}>
                        <span style={styles.navGroupTitle}>Reports</span>
                        <div style={styles.navSubmenu} className="nav-submenu">
                            <Link to="/reports/profit-loss" style={styles.navSubLink} className="nav-sub-link">
                                <span style={styles.navIcon}>📊</span>
                                P&L
                            </Link>
                            <Link to="/reports/balance-sheet" style={styles.navSubLink} className="nav-sub-link">
                                <span style={styles.navIcon}>⚖️</span>
                                Balance Sheet
                            </Link>
                            <Link to="/reports/stock-account" style={styles.navSubLink} className="nav-sub-link">
                                <span style={styles.navIcon}>📦</span>
                                Stock
                            </Link>
                            <Link to="/reports/partner-ledger" style={styles.navSubLink} className="nav-sub-link">
                                <span style={styles.navIcon}>👥</span>
                                Partner Ledger
                            </Link>
                        </div>
                    </div>

                    {/* Master Data Section */}
                    <div style={styles.navGroup}>
                        <span style={styles.navGroupTitle}>Master Data</span>
                        <div style={styles.navSubmenu} className="nav-submenu">
                            <Link to="/contacts" style={styles.navSubLink} className="nav-sub-link">
                                <span style={styles.navIcon}>👥</span>
                                Contacts
                            </Link>
                            <Link to="/products" style={styles.navSubLink} className="nav-sub-link">
                                <span style={styles.navIcon}>📦</span>
                                Products
                            </Link>
                            <Link to="/taxes" style={styles.navSubLink} className="nav-sub-link">
                                <span style={styles.navIcon}>📋</span>
                                Taxes
                            </Link>
                            <Link to="/accounts" style={styles.navSubLink} className="nav-sub-link">
                                <span style={styles.navIcon}>📊</span>
                                Chart of Accounts
                            </Link>
                        </div>
                    </div>
                </div>

                {/* User Actions */}
                <div style={styles.userActions}>
                    <div style={styles.userInfo}>
                        Welcome, {localStorage.getItem('userRole') || 'User'}
                    </div>
                    <button 
                        onClick={() => { 
                            localStorage.removeItem('token'); 
                            localStorage.removeItem('userRole');
                            localStorage.removeItem('userId');
                            window.location.href = '/login'; 
                        }}
                        style={styles.logoutButton}
                        className="logout-button"
                    >
                        <span style={styles.navIcon}>🚪</span>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
        <main style={styles.mainContent}>{children}</main>
    </div>
);

const styles = {
    layout: {
        minHeight: '100vh',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    navbar: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
    },
    navContent: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        maxWidth: '1400px',
        margin: '0 auto',
        minHeight: '70px'
    },
    logoSection: {
        display: 'flex',
        alignItems: 'center'
    },
    logoLink: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        textDecoration: 'none',
        color: 'white',
        fontSize: '20px',
        fontWeight: '700',
        transition: 'all 0.2s ease'
    },
    logoIcon: {
        fontSize: '28px'
    },
    logoText: {
        fontSize: '20px',
        fontWeight: '700'
    },
    navMenu: {
        display: 'flex',
        alignItems: 'center',
        gap: '40px',
        flex: 1,
        justifyContent: 'center'
    },
    navGroup: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px'
    },
    navGroupTitle: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: '12px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: '4px'
    },
    navSubmenu: {
        display: 'flex',
        gap: '20px',
        alignItems: 'center'
    },
    navLink: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: 'white',
        textDecoration: 'none',
        padding: '12px 16px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'all 0.2s ease',
        background: 'rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.2)'
    },
    navSubLink: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        color: 'white',
        textDecoration: 'none',
        padding: '8px 12px',
        borderRadius: '6px',
        fontSize: '13px',
        fontWeight: '500',
        transition: 'all 0.2s ease',
        background: 'rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.1)'
    },
    navIcon: {
        fontSize: '16px'
    },
    userActions: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    userInfo: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: '14px',
        fontWeight: '500'
    },
    logoutButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(255,255,255,0.2)',
        color: 'white',
        border: '1px solid rgba(255,255,255,0.3)',
        padding: '10px 16px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
    },
    mainContent: {
        padding: '20px',
        maxWidth: '1400px',
        margin: '0 auto',
        width: '100%'
    }
};

function App() {
  const userRole = localStorage.getItem('userRole'); // Assuming role is stored here

  return (
    <div className="bg-background text-foreground">
      <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/test-signup" element={<TestSignup />} />
          <Route path="/dashboard" element={<MainLayout><DashboardPage /></MainLayout>} />
          <Route path="/contacts" element={<MainLayout><ContactPage /></MainLayout>} />
          <Route path="/products" element={<MainLayout><ProductPage /></MainLayout>} />
          <Route path="/taxes" element={<MainLayout><TaxPage /></MainLayout>} />
          <Route path="/accounts" element={<MainLayout><AccountPage /></MainLayout>} />
          <Route path="/purchase-orders" element={<MainLayout><PurchaseOrderListPage /></MainLayout>} />
          <Route path="/purchase-orders/new" element={<MainLayout><PurchaseOrderFormPage /></MainLayout>} />
          <Route path="/purchase-orders/:id" element={<MainLayout><PurchaseOrderDetailPage /></MainLayout>} />
          <Route path="/vendor-bills" element={<MainLayout><VendorBillListPage /></MainLayout>} />
          <Route path="/vendor-bills/:id" element={<MainLayout><VendorBillDetailPage /></MainLayout>} />
          <Route path="/sales-orders" element={<MainLayout><SalesOrderListPage /></MainLayout>} />
          <Route path="/sales-orders/new" element={<MainLayout><SalesOrderFormPage /></MainLayout>} />
          <Route path="/sales-orders/:id" element={<MainLayout><SalesOrderDetailPage /></MainLayout>} />
          <Route path="/customer-invoices" element={<MainLayout><CustomerInvoiceListPage /></MainLayout>} />
          <Route path="/customer-invoices/:id" element={<MainLayout><CustomerInvoiceDetailPage /></MainLayout>} />
          <Route path="/reports/profit-loss" element={<MainLayout><ProfitLossPage /></MainLayout>} />
          <Route path="/reports/stock-account" element={<MainLayout><StockAccountPage /></MainLayout>} />
          <Route path="/reports/balance-sheet" element={<MainLayout><BalanceSheetPage /></MainLayout>} />
          <Route path="/reports/partner-ledger" element={<MainLayout><PartnerLedgerPage /></MainLayout>} />
          <Route path="/customer-portal" element={<CustomerPortalPage />} />
          <Route path="/" element={isLoggedIn() ? (userRole === 'Contact' ? <CustomerPortalPage /> : <MainLayout><DashboardPage /></MainLayout>) : <LoginPage />} />
        </Routes>
    </Router>
    </div>
  );
}

export default App;