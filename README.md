# Shiv Accounts Cloud

## Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v16 or later)
*   [Git](https://git-scm.com/)

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone git@github.com:Vishal-gsu/shiv_acct.git
    cd shiv_acct
    ```

2.  **Set up the Backend Server:**
    ```sh
    cd server
    npm install
    ```

3.  **Set up the Frontend Client:**
    ```sh
    cd ../client
    npm install
    ```

### Running the Application

1.  **Start the Backend Server:**
    *   In a terminal, navigate to the `server` directory and run:
    ```sh
    npm start
    ```
    *   The API server will be running at `http://localhost:3001`.

2.  **Start the Frontend Client:**
    *   In a **new** terminal, navigate to the `client` directory and run:
    ```sh
    npm run dev
    ```
    *   Open the URL provided in the terminal (usually `http://localhost:5173`) in your browser.

---

## 1. Overview

Shiv Accounts Cloud is a cloud-based accounting system designed for Shiv Furniture. It provides a comprehensive solution for managing core business financials, from master data entry to real-time financial reporting. The system enables the smooth recording of sales, purchases, and payments, which automatically updates inventory and generates critical financial statements like the Balance Sheet and Profit & Loss report.

### Problem Statement
To create a centralized and automated accounting system that replaces manual bookkeeping, reduces errors, and provides real-time insights into the financial health and stock levels of the business.

---

## 2. User Roles & Permissions

The system defines three distinct user roles with specific access levels:

| Role | Description | Key Permissions |
| :--- | :--- | :--- |
| **Admin (Business Owner)** | Has full control over the system. | ● Create, Modify, and Archive all Master Data.<br>● Record all Transactions.<br>● View all Reports. |
| **Invoicing User (Accountant)** | Manages day-to-day accounting tasks. | ● Create and Modify Master Data.<br>● Record all Transactions.<br>● View all Reports. |
| **Contact** | A customer or vendor with limited portal access. | ● View their own invoices and bills.<br>● Record payments against their transactions. |

---

## 3. UI/UX Flow & System Features

### 3.1. Authentication

*   **Signup Page**: New users can register for an account.
    *   **Fields**: Name, Login ID (must be unique), Email (must be unique), Password (must be a strong password), Re-enter Password.
*   **Login Page**: Registered users can access the system.
    *   **Fields**: Login ID, Password.

### 3.2. Main Navigation & Dashboard

A persistent top menu bar ensures easy navigation across the application.

*   **Menu Structure**:
    *   **Purchase**: Purchase Order, Purchase Bill, Payment
    *   **Sale**: Sale Order, Sale Invoice, Receipt
    *   **Report**: Profit and Loss, Balance Sheet, Stock Statement

*   **Dashboard**: The landing page after login provides a high-level overview of business activity.
    *   **Total Invoices**: Clickable card showing totals for the last 24 hours, 7 days, and 30 days.
    *   **Total Purchases**: Clickable card showing totals for the last 24 hours, 7 days, and 30 days.
    *   **Total Payments**: Clickable card showing totals for the last 24 hours, 7 days, and 30 days.

### 3.3. Master Data Management

All master data sections feature a default list view of existing records. A "New" button opens a form to create a new entry. Clicking an existing record opens its details in a form view for editing.

#### 3.3.1. Contact Master
Stores details of customers and vendors.
*   **List View Columns**: Profile Image, Contact Name, Email, Phone.
*   **Form Fields**:
    *   Contact Name (Text)
    *   Type (Dropdown: Customer, Vendor, Both)
    *   Email (Email, must be unique)
    *   Phone (Integer)
    *   Address (City, State, Pincode)
    *   Profile Image (File Upload)

#### 3.3.2. Product Master
Stores details of goods and services offered.
*   **Form Fields**:
    *   Product Name (Text)
    *   Type (Dropdown: Goods, Service)
    *   Category (Text)
    *   HSN/SAC Code (Fetched from API)
    *   Sales Price (Decimal)
    *   Sales Tax (Selection from Tax Master)
    *   Purchase Price (Decimal)
    *   Purchase Tax (Selection from Tax Master)

#### 3.3.3. Tax Master
Defines applicable tax rates for sales and purchases.
*   **Form Fields**:
    *   Tax Name (Text, e.g., "GST 5%")
    *   Tax Computation (Dropdown: Percentage, Fixed Value)
    *   Applicable For (Dropdown: Sales, Purchase)
    *   Value (Decimal)

#### 3.3.4. Chart of Accounts Master
A structured list of all financial accounts.
*   **Form Fields**:
    *   Account Name (Text, e.g., "Cash", "Sales Income")
    *   Account Type (Dropdown: Asset, Liability, Expense, Income, Equity)

---

## 4. Transaction Flow

Transactions are created using the predefined master data, ensuring data integrity and enabling automated ledger posting.

| Step | Process | Details / Fields | Real-time Impact |
| :--- | :--- | :--- | :--- |
| 1 | **Purchase Order (PO)** | Select Vendor, Product, Quantity, Unit Price, Tax Rate. | None (Confirms intent to buy). |
| 2 | **Vendor Bill** | Convert PO to Bill. Record Invoice Date, Due Date. | ● Increases Accounts Payable (Liability).<br>● Updates Partner Ledger for the vendor. |
| 3 | **Bill Payment** | Register payment against the bill via Cash or Bank. | ● Decreases Cash/Bank (Asset).<br>● Decreases Accounts Payable (Liability). |
| 4 | **Sales Order (SO)** | Select Customer, Product, Quantity, Unit Price, Tax Rate. | ● Reduces `Quantity on Hand` in inventory.<br>● Increases `Quantity to be Shipped`. |
| 5 | **Customer Invoice** | Generate Invoice from SO. | ● Increases Accounts Receivable (Asset).<br>● Increases Sales (Income).<br>● Updates Partner Ledger for the customer. |
| 6 | **Invoice Receipt** | Receive payment against the invoice via Cash or Bank. | ● Increases Cash/Bank (Asset).<br>● Decreases Accounts Receivable (Asset). |

---

## 5. Reporting Requirements

The system generates the following reports in real-time based on recorded transactions.

1.  **Balance Sheet**
    *   A snapshot of the company's financial position at a specific point in time.
    *   **Formula**: `Assets = Liabilities + Equity`
    *   Shows balances for accounts like Bank, Cash, Debtors (Assets), and Creditors (Liabilities).

2.  **Profit & Loss (P&L) Account**
    *   Summarizes revenues, costs, and expenses incurred during a specific period.
    *   Shows `Sales Income` minus `Purchases Expense` to calculate net profit or loss.

3.  **Stock Statement / Inventory Report**
    *   Tracks the movement and valuation of products.
    *   **Columns**: Product Name, Purchased Qty, Sales Qty, Available Qty.

---

## 6. API Documentation & Glossary

*   **API Documentation**: For details on HSN/SAC code fetching and other potential integrations, please refer to the official API documentation:
    [API Documentation Link](https://drive.google.com/file/d/1zeyV15pIQekxdDXn3p9pmssCvaQUMEBe/view?usp=sharing)

*   **Mockup Link**:
    [Excalidraw Mockup](https://link.excalidraw.com/l/65VNwvy7c4X/AtwSUrDjbwK)

### Glossary
*   **Chart of Accounts (CoA)**: A structured list of all financial accounts (Assets, Liabilities, etc.).
*   **Partner Ledger**: A detailed report of all transactions for a specific customer or vendor.
*   **HSN Code**: A standardized classification system for goods, used for taxation.

---

## 7. Hackathon Project Importance

This project is a valuable learning experience because it:
*   Teaches real-world ERP and accounting workflows.
*   Demonstrates how different business modules (e.g., Sales, Inventory) are interconnected.
*   Encourages problem-solving based on business logic rather than just pure coding challenges.
