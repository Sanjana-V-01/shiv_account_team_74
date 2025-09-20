# Shiv Accounts Cloud

## Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v16 or later)
*   [npm](https://www.npmjs.com/) (Node Package Manager)
*   [Git](https://git-scm.com/)

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/Vishal-gsu/shiv_acct.git
    cd shiv_acct
    ```

2.  **Set up the Backend Server:**
    *   Navigate to the `server` directory:
        ```sh
        cd server
        ```
    *   Install dependencies:
        ```sh
        npm install
        ```

3.  **Set up the Frontend Client:**
    *   Navigate to the `client` directory:
        ```sh
        cd ../client
        ```
    *   Install dependencies:
        ```sh
        npm install
        ```

### Running the Application

1.  **Start the Backend Server:**
    *   In a terminal, navigate to the `server` directory and run:
    ```sh
    npm run dev
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

## 2. Key Features Implemented

*   **User Authentication**: Secure Login and Registration.
*   **Master Data Management**: Full CRUD (Create, Read, Update, Delete) for:
    *   Contacts (Customers, Vendors)
    *   Products
    *   Taxes
    *   Chart of Accounts
*   **Purchase Workflow**: End-to-end process:
    *   Purchase Orders (Creation, Listing, Viewing Details)
    *   Vendor Bills (Conversion from PO, Listing)
    *   Payments (Registration against Bills)
*   **Sales Workflow**: End-to-end process:
    *   Sales Orders (Creation, Listing, Viewing Details)
    *   Customer Invoices (Conversion from SO, Listing)
    *   Receipts (Registration against Invoices)
*   **Reporting**: Real-time generation of:
    *   Profit & Loss Statement
    *   Stock Account / Inventory Report
    *   Balance Sheet
*   **Dashboard**: Summary of key financial metrics.

---

## 3. User Roles & Permissions

The system defines three distinct user roles with specific access levels:

| Role | Description | Key Permissions |
| :--- | :--- | :--- |
| **Admin (Business Owner)** | Has full control over the system. | ● Create, Modify, and Archive all Master Data.<br>● Record all Transactions.<br>● View all Reports. |
| **Invoicing User (Accountant)** | Manages day-to-day accounting tasks. | ● Create and Modify Master Data.<br>● Record all Transactions.<br>● View all Reports. |
| **Contact** | A customer or vendor with limited portal access. | ● View their own invoices and bills.<br>● Record payments against their transactions. |

---

## 4. Architecture & Data Model

### 4.1. High-Level Architecture

The application follows a client-server architecture:
*   **Frontend (Client)**: Built with React (Vite) for a dynamic single-page application (SPA).
*   **Backend (Server)**: Built with Node.js and Express.js, serving as a RESTful API.
*   **Database**: Simple JSON file-based storage for quick prototyping. Each major entity has its own `.json` file (e.g., `users.json`, `contacts.json`).

### 4.2. Data Models (JSON File Structures)

#### `users.json`
Stores user authentication details.
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "loginId": "johndoe",
    "email": "john.doe@example.com",
    "password": "$2a$10$hashedpassword",
    "role": "Invoicing User"
  }
]
```

#### `contacts.json`
Stores customer and vendor information.
```json
[
  {
    "id": 1,
    "name": "Azure Furniture",
    "type": "Vendor",
    "email": "azure@example.com",
    "phone": "1234567890",
    "address": "123 Main St, City"
  }
]
```

#### `products.json`
Stores details of goods and services.
```json
[
  {
    "id": 1,
    "name": "Office Chair",
    "type": "Goods",
    "salesPrice": 150.00,
    "purchasePrice": 100.00,
    "hsnCode": "9401"
  }
]
```

#### `taxes.json`
Defines tax rates.
```json
[
  {
    "id": 1,
    "name": "GST 5%",
    "computation": "Percentage",
    "applicableOn": "Sales",
    "value": 5
  }
]
```

#### `accounts.json`
Chart of Accounts entries.
```json
[
  {
    "id": 1,
    "name": "Cash",
    "type": "Asset"
  }
]
```

#### `purchaseOrders.json`
Records purchase orders.
```json
[
  {
    "id": 1,
    "vendor": { "id": 1, "name": "Azure Furniture" },
    "orderDate": "2025-09-20",
    "items": [
      {
        "productId": 1,
        "quantity": 10,
        "unitPrice": 100.00,
        "product": { "id": 1, "name": "Office Chair" }
      }
    ],
    "totalAmount": 1000.00,
    "status": "Billed"
  }
]
```

#### `vendorBills.json`
Records vendor bills (purchase invoices).
```json
[
  {
    "id": 1,
    "purchaseOrderId": 1,
    "vendor": { "id": 1, "name": "Azure Furniture" },
    "billDate": "2025-09-21",
    "dueDate": "2025-10-21",
    "items": [ { /* ... same as PO items */ } ],
    "totalAmount": 1000.00,
    "status": "Paid"
  }
]
```

#### `payments.json`
Records payments made against vendor bills.
```json
[
  {
    "id": 1,
    "vendorBillId": 1,
    "amount": 1000.00,
    "paymentDate": "2025-09-22",
    "paymentMethod": "Bank"
  }
]
```

#### `salesOrders.json`
Records sales orders.
```json
[
  {
    "id": 1,
    "customer": { "id": 2, "name": "Nimesh Pathak" },
    "orderDate": "2025-09-20",
    "items": [
      {
        "productId": 1,
        "quantity": 5,
        "unitPrice": 150.00,
        "product": { "id": 1, "name": "Office Chair" }
      }
    ],
    "totalAmount": 750.00,
    "status": "Invoiced"
  }
]
```

#### `customerInvoices.json`
Records customer invoices (sales invoices).
```json
[
  {
    "id": 1,
    "salesOrderId": 1,
    "customer": { "id": 2, "name": "Nimesh Pathak" },
    "invoiceDate": "2025-09-21",
    "dueDate": "2025-10-21",
    "items": [ { /* ... same as SO items */ } ],
    "totalAmount": 750.00,
    "status": "Paid"
  }
]
```

#### `receipts.json`
Records receipts (payments received from customers).
```json
[
  {
    "id": 1,
    "customerInvoiceId": 1,
    "amount": 750.00,
    "receiptDate": "2025-09-22",
    "paymentMethod": "Cash"
  }
]
```

---

## 5. API Endpoints Reference

All API endpoints are prefixed with `http://localhost:3001/api/`.

### Authentication
*   `POST /auth/register`: Register a new user.
*   `POST /auth/login`: Authenticate user and receive a JWT token.

### Master Data

#### Contacts
*   `GET /contacts`: Get all contacts.
*   `POST /contacts`: Create a new contact.
*   `GET /contacts/:id`: Get a single contact by ID.
*   `PUT /contacts/:id`: Update a contact by ID.
*   `DELETE /contacts/:id`: Delete a contact by ID.

#### Products
*   `GET /products`: Get all products.
*   `POST /products`: Create a new product.
*   `GET /products/:id`: Get a single product by ID.
*   `PUT /products/:id`: Update a product by ID.
*   `DELETE /products/:id`: Delete a product by ID.

#### Taxes
*   `GET /taxes`: Get all taxes.
*   `POST /taxes`: Create a new tax.
*   `GET /taxes/:id`: Get a single tax by ID.
*   `PUT /taxes/:id`: Update a tax by ID.
*   `DELETE /taxes/:id`: Delete a tax by ID.

#### Chart of Accounts
*   `GET /accounts`: Get all accounts.
*   `POST /accounts`: Create a new account.
*   `GET /accounts/:id`: Get a single account by ID.
*   `PUT /accounts/:id`: Update an account by ID.
*   `DELETE /accounts/:id`: Delete an account by ID.

### Purchase Workflow

#### Purchase Orders
*   `GET /purchase-orders`: Get all purchase orders.
*   `POST /purchase-orders`: Create a new purchase order.
*   `GET /purchase-orders/:id`: Get a single purchase order by ID.
*   `PUT /purchase-orders/:id`: Update a purchase order by ID.
*   `DELETE /purchase-orders/:id`: Delete a purchase order by ID.

#### Vendor Bills
*   `GET /vendor-bills`: Get all vendor bills.
*   `POST /vendor-bills`: Create a new vendor bill (typically from a Purchase Order ID).

#### Payments
*   `GET /payments`: Get all payments.
*   `POST /payments`: Record a new payment against a vendor bill.

### Sales Workflow

#### Sales Orders
*   `GET /sales-orders`: Get all sales orders.
*   `POST /sales-orders`: Create a new sales order.
*   `GET /sales-orders/:id`: Get a single sales order by ID.
*   `PUT /sales-orders/:id`: Update a sales order by ID.
*   `DELETE /sales-orders/:id`: Delete a sales order by ID.

#### Customer Invoices
*   `GET /customer-invoices`: Get all customer invoices.
*   `POST /customer-invoices`: Create a new customer invoice (typically from a Sales Order ID).

#### Receipts
*   `GET /receipts`: Get all receipts.
*   `POST /receipts`: Record a new receipt against a customer invoice.

### Reports

*   `GET /reports/profit-loss`: Generate a Profit & Loss statement.
*   `GET /reports/stock-account`: Generate a Stock Account / Inventory report.
*   `GET /reports/balance-sheet`: Generate a Balance Sheet report.
*   `GET /reports/dashboard-summary`: Get summary data for the dashboard.

---

## 6. Frontend Components Overview

All frontend components are located in `client/src/pages/`.

*   `LoginPage.jsx`: User login form.
*   `SignupPage.jsx`: User registration form.
*   `DashboardPage.jsx`: Displays key financial summaries.
*   `ContactPage.jsx`: CRUD interface for Contacts.
*   `ProductPage.jsx`: CRUD interface for Products.
*   `TaxPage.jsx`: CRUD interface for Taxes.
*   `AccountPage.jsx`: CRUD interface for Chart of Accounts.
*   `PurchaseOrderListPage.jsx`: Lists all Purchase Orders.
*   `PurchaseOrderFormPage.jsx`: Form for creating/editing Purchase Orders.
*   `PurchaseOrderDetailPage.jsx`: Displays details of a single Purchase Order.
*   `VendorBillListPage.jsx`: Lists all Vendor Bills.
*   `SalesOrderListPage.jsx`: Lists all Sales Orders.
*   `SalesOrderFormPage.jsx`: Form for creating/editing Sales Orders.
*   `SalesOrderDetailPage.jsx`: Displays details of a single Sales Order.
*   `CustomerInvoiceListPage.jsx`: Lists all Customer Invoices.
*   `ProfitLossPage.jsx`: Displays the Profit & Loss Statement.
*   `StockAccountPage.jsx`: Displays the Stock Account / Inventory Report.
*   `BalanceSheetPage.jsx`: Displays the Balance Sheet Report.

---

## 7. External API Integration

*   **HSN Code Search**: The application is designed to integrate with the GST India HSN search API for product classification. This is currently a placeholder in the Product Master form and would require backend integration to fetch data from:
    `GET https://services.gst.gov.in/commonservices/hsn/search/qsearch`
    (Parameters: `inputText`, `selectedType`, `category`)

---

## 8. Hackathon Project Importance

This project is a valuable learning experience because it:
*   Teaches real-world ERP and accounting workflows.
*   Demonstrates how different business modules (e.g., Sales, Inventory) are interconnected.
*   Encourages problem-solving based on business logic rather than just pure coding challenges.