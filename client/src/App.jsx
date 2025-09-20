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
import SalesOrderListPage from './pages/SalesOrderListPage';
import SalesOrderFormPage from './pages/SalesOrderFormPage';
import SalesOrderDetailPage from './pages/SalesOrderDetailPage';
import CustomerInvoiceListPage from './pages/CustomerInvoiceListPage';
import ProfitLossPage from './pages/ProfitLossPage';
import StockAccountPage from './pages/StockAccountPage';
import BalanceSheetPage from './pages/BalanceSheetPage'; // Import Balance Sheet Page
import './App.css';

// A simple check to see if the user is logged in
const isLoggedIn = () => !!localStorage.getItem('token');

const MainLayout = ({ children }) => (
    <div>
        <nav>
            <div style={{ float: 'left' }}>
                <Link to="/dashboard">Dashboard</Link> | 
                <b>Purchase:</b> <Link to="/purchase-orders">Order</Link> | <Link to="/vendor-bills">Bill</Link> | <Link to="#">Payment</Link> | 
                <b>Sale:</b> <Link to="/sales-orders">Order</Link> | <Link to="/customer-invoices">Invoice</Link> | <Link to="#">Receipt</Link> | 
                <b>Report:</b> <Link to="/reports/profit-loss">P&L</Link> | <Link to="/reports/balance-sheet">Balance Sheet</Link> | <Link to="/reports/stock-account">Stock</Link> | 
                <b>Master Data:</b> <Link to="/contacts">Contacts</Link> | <Link to="/products">Products</Link> | <Link to="/taxes">Taxes</Link> | <Link to="/accounts">Chart of Accounts</Link>
            </div>
            <div style={{ float: 'right' }}>
                <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}>Logout</button>
            </div>
            <div style={{ clear: 'both' }}></div>
        </nav>
        <main style={{padding: '1rem'}}>{children}</main>
    </div>
);

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<MainLayout><DashboardPage /></MainLayout>} />
          <Route path="/contacts" element={<MainLayout><ContactPage /></MainLayout>} />
          <Route path="/products" element={<MainLayout><ProductPage /></MainLayout>} />
          <Route path="/taxes" element={<MainLayout><TaxPage /></MainLayout>} />
          <Route path="/accounts" element={<MainLayout><AccountPage /></MainLayout>} />
          <Route path="/purchase-orders" element={<MainLayout><PurchaseOrderListPage /></MainLayout>} />
          <Route path="/purchase-orders/new" element={<MainLayout><PurchaseOrderFormPage /></MainLayout>} />
          <Route path="/purchase-orders/:id" element={<MainLayout><PurchaseOrderDetailPage /></MainLayout>} />
          <Route path="/vendor-bills" element={<MainLayout><VendorBillListPage /></MainLayout>} />
          <Route path="/sales-orders" element={<MainLayout><SalesOrderListPage /></MainLayout>} />
          <Route path="/sales-orders/new" element={<MainLayout><SalesOrderFormPage /></MainLayout>} />
          <Route path="/sales-orders/:id" element={<MainLayout><SalesOrderDetailPage /></MainLayout>} />
          <Route path="/customer-invoices" element={<MainLayout><CustomerInvoiceListPage /></MainLayout>} />
          <Route path="/reports/profit-loss" element={<MainLayout><ProfitLossPage /></MainLayout>} />
          <Route path="/reports/stock-account" element={<MainLayout><StockAccountPage /></MainLayout>} />
          <Route path="/reports/balance-sheet" element={<MainLayout><BalanceSheetPage /></MainLayout>} />
          <Route path="/" element={isLoggedIn() ? <MainLayout><DashboardPage /></MainLayout> : <LoginPage />} />
        </Routes>
    </Router>
  );
}

export default App;