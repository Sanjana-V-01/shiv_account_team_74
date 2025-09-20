# Shiv Accounts Cloud

## Getting Started

Follow these instructions to set up and run the project on your local machine. The application uses Firebase for its backend, including Firestore for the database, Firebase Authentication for user management, and Cloud Functions for server-side logic like cascading deletes and stock updates.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v16 or later)
*   [npm](https://www.npmjs.com/) (Node Package Manager)
*   [Git](https://git-scm.com/)
*   **Firebase Project**: A Firebase project configured with Firestore in Native Mode, Firebase Authentication, and Cloud Functions enabled. (See Firebase Setup below)
*   **Firebase CLI**: [Firebase CLI](https://firebase.google.com/docs/cli#install_the_firebase_cli) installed globally (`npm install -g firebase-tools`)

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/Vishal-gsu/shiv_acct.git
    cd shiv_acct
    ```

2.  **Firebase Project Setup (One-time for your Firebase Project)**
    *   Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
    *   **Crucially**, when setting up Firestore, ensure you select **"Firestore in Native Mode"**.
    *   Enable **Firebase Authentication** (Email/Password provider).
    *   Upgrade your project to the **Blaze plan (pay-as-you-go)**. (Note: You only pay if you exceed the free tier limits).

3.  **Configure Firebase Credentials:**
    *   **For the Client (React App):**
        *   In your Firebase project settings, add a new Web App (`</>`).
        *   Copy the `firebaseConfig` object provided. You will paste this into `client/src/firebase.js`.
    *   **For the Server (Node.js/Express):**
        *   In your Firebase project settings, go to the "Service accounts" tab.
        *   Click "Generate new private key" and download the JSON file.
        *   Rename this file to `firebase-service-account.json` and place it in the `server/` directory of your cloned project.
        *   **IMPORTANT**: This file is sensitive and is already ignored by `.gitignore`.

4.  **Associate Project with Firebase CLI:**
    *   Navigate to the `server` directory:
        ```sh
        cd server
        ```
    *   Log in to Firebase CLI:
        ```sh
        firebase login
        ```
    *   Initialize Firebase for functions and Firestore rules (select `Functions` and `Firestore`):
        ```sh
        firebase init
        ```
        *   Select "Use an existing project" and choose your Firebase project (`acct-hackathon`).
        *   Select `JavaScript` for functions language, and `No` for ESLint.
        *   Accept default filenames for Firestore rules and indexes.
        *   Install npm dependencies when prompted.

5.  **Install Node.js Dependencies:**
    *   **For the Backend Server:**
        ```sh
        cd server
        npm install
        ```
    *   **For the Frontend Client:**
        ```sh
        cd ../client
        npm install
        ```

6.  **Deploy Cloud Functions:**
    *   From the `server` directory, deploy the Cloud Functions for cascading deletes and stock updates:
        ```sh
        firebase deploy --only functions
        ```

### Running the Application

1.  **Start the Backend Server:**
    *   In a terminal, navigate to the `server` directory and run:
    ```sh
    node index.js
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

*   **User Authentication**: Secure Login and Registration using Firebase Authentication.
*   **Master Data Management**: Full CRUD (Create, Read, Update, Delete) for:
    *   Contacts (Customers, Vendors)
    *   Products (now with direct `currentStock` management)
    *   Taxes
    *   Chart of Accounts
*   **Purchase Workflow**: End-to-end process:
    *   Purchase Orders (Creation, Listing, Viewing Details)
    *   Vendor Bills (Conversion from PO, Listing)
    *   Payments (Registration against Bills)
    *   **Automated Stock Update**: Creating a Purchase Order now automatically increases product `currentStock`.
*   **Sales Workflow**: End-to-end process:
    *   Sales Orders (Creation, Listing, Viewing Details)
    *   Customer Invoices (Conversion from SO, Listing)
    *   Receipts (Registration against Invoices)
*   **Reporting**: Real-time generation of:
    *   Profit & Loss Statement
    *   Stock Account / Inventory Report (now based on direct `currentStock`)
    *   Balance Sheet
*   **Dashboard**: Summary of key financial metrics.
*   **Cascading Deletes**: Deleting a Purchase Order automatically deletes associated Vendor Bills. Deleting a Sales Order automatically deletes associated Customer Invoices.

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
*   **Database**: **Google Cloud Firestore (Native Mode)** for robust, scalable, and real-time data storage.
*   **Authentication**: **Firebase Authentication** for secure user management.
*   **Server-side Logic**: **Firebase Cloud Functions** for automated tasks like cascading deletes and stock updates.

### 4.2. Data Models (Firestore Collections)

Data is now stored in Firestore collections. The structure within each document generally mirrors the previous JSON structures, with IDs now being Firestore-generated document IDs.

#### `users` Collection
Stores additional user details linked by Firebase Authentication UID.
```json
// Document ID is Firebase Auth UID
{
  "name": "John Doe",
  "loginId": "johndoe",
  "email": "john.doe@example.com",
  "role": "Invoicing User"
}
```

#### `contacts` Collection
Stores customer and vendor information.
```json
// Document ID is Firestore-generated
{
  "name": "Azure Furniture",
  "type": "Vendor",
  "email": "azure@example.com",
  "phone": "1234567890",
  "address": "123 Main St, City",
  "profileImage": null // Path to uploaded image
}
```

#### `products` Collection
Stores details of goods and services, now including `currentStock`.
```json
// Document ID is Firestore-generated
{
  "name": "Office Chair",
  "type": "Goods",
  "salesPrice": "150",
  "purchasePrice": "100",
  "hsnCode": "9401",
  "currentStock": 50 // Directly editable stock
}
```

#### `taxes` Collection
Defines tax rates.
```json
// Document ID is Firestore-generated
{
  "name": "GST 5%",
  "computation": "Percentage",
  "applicableOn": "Sales",
  "value": "5"
}
```

#### `accounts` Collection
Chart of Accounts entries.
```json
// Document ID is Firestore-generated
{
  "name": "Cash",
  "type": "Asset"
}
```

#### `purchaseOrders` Collection
Records purchase orders.
```json
// Document ID is Firestore-generated
{
  "vendor": { "id": "firestore_contact_id", "name": "Azure Furniture" },
  "orderDate": "2025-09-20",
  "items": [
    {
      "productId": "firestore_product_id",
      "quantity": 10,
      "unitPrice": "100",
      "product": { "id": "firestore_product_id", "name": "Office Chair" }
    }
  ],
  "totalAmount": "1000",
  "status": "Billed"
}
```

#### `vendorBills` Collection
Records vendor bills (purchase invoices).
```json
// Document ID is Firestore-generated
{
  "purchaseOrderId": "firestore_po_id",
  "vendor": { "id": "firestore_contact_id", "name": "Azure Furniture" },
  "billDate": "2025-09-21",
  "dueDate": "2025-10-21",
  "items": [ { /* ... same as PO items */ } ],
  "totalAmount": "1000",
  "status": "Paid"
}
```

#### `payments` Collection
Records payments made against vendor bills.
```json
// Document ID is Firestore-generated
{
  "vendorBillId": "firestore_bill_id",
  "amount": "1000",
  "paymentDate": "2025-09-22",
  "paymentMethod": "Bank"
}
```

#### `salesOrders` Collection
Records sales orders.
```json
// Document ID is Firestore-generated
{
  "customer": { "id": "firestore_contact_id", "name": "Nimesh Pathak" },
  "orderDate": "2025-09-20",
  "items": [
    {
      "productId": "firestore_product_id",
      "quantity": 5,
      "unitPrice": "150",
      "product": { "id": "firestore_product_id", "name": "Office Chair" }
    }
  ],
  "totalAmount": "750",
  "status": "Invoiced"
}
```

#### `customerInvoices` Collection
Records customer invoices (sales invoices).
```json
// Document ID is Firestore-generated
{
  "salesOrderId": "firestore_so_id",
  "customer": { "id": "firestore_contact_id", "name": "Nimesh Pathak" },
  "invoiceDate": "2025-09-21",
  "dueDate": "2025-10-21",
  "items": [ { /* ... same as SO items */ } ],
  "totalAmount": "750",
  "status": "Paid"
}
```

#### `receipts` Collection
Records receipts (payments received from customers).
```json
// Document ID is Firestore-generated
{
  "customerInvoiceId": "firestore_invoice_id",
  "amount": "750",
  "receiptDate": "2025-09-22",
  "paymentMethod": "Cash"
}
```

---

## 5. API Endpoints Reference

All API endpoints are prefixed with `http://localhost:3001/api/`.

### Authentication
*   `POST /auth/register`: Register a new user (uses Firebase Authentication for user creation, saves additional details to Firestore).
*   `GET /users/:id`: Get user details by Firebase Auth UID (requires Firebase ID Token in Authorization header).

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
*   `GET /reports/stock-account`: Generate a Stock Account / Inventory report (now based on `currentStock` field).
*   `GET /reports/balance-sheet`: Generate a Balance Sheet report.
*   `GET /reports/dashboard-summary`: Get summary data for the dashboard.
*   `GET /reports/partner-ledger`: Generate a Partner Ledger report.

---

## 6. Frontend Components Overview

All frontend components are located in `client/src/pages/`.

*   `LoginPage.jsx`: User login form (uses Firebase Authentication).
*   `SignupPage.jsx`: User registration form (uses Firebase Authentication).
*   `DashboardPage.jsx`: Displays key financial summaries.
*   `ContactPage.jsx`: CRUD interface for Contacts.
*   `ProductPage.jsx`: CRUD interface for Products (now with `currentStock` field).
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
*   `PartnerLedgerPage.jsx`: Displays the Partner Ledger Report.
*   `CustomerPortalPage.jsx`: Customer-specific portal for invoices and receipts.

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

---

## 9. Data Migration (Optional)

If you have existing data in the old JSON format and wish to migrate it to Firestore, you can use the migration scripts. **Note: These scripts are for one-time use and assume an empty target collection.**

1.  Ensure your `server/db` directory contains the JSON files with your data.
2.  Ensure your Firebase project is correctly set up and associated with the CLI (steps 2-4 in Installation & Setup).
3.  Run the following commands from the `server/` directory:
    ```sh
    # Example for products
    node migrate_products.js
    # Repeat for other data types (contacts, purchaseOrders, vendorBills, customerInvoices)
    ```
    *   You will need to temporarily create the `migrate_products.js` (or `migrate_contacts.js`, etc.) file in the `server/` directory with the content I provided during the migration process. After running, delete the script file.

---

## 10. Troubleshooting

*   **`ERR_CONNECTION_REFUSED`**: Ensure both your backend (`node index.js`) and frontend (`npm run dev`) servers are running.
*   **`Firebase App '[DEFAULT]' has not been created`**: Ensure `client/src/firebase.js` is correctly configured with your `firebaseConfig` and that `client/src/main.jsx` imports `./firebase`.
*   **Cloud Functions Deployment Errors (e.g., `Permission denied`, `Blaze plan required`)**: Ensure your Firebase project is on the Blaze plan and that you have waited a few minutes for permissions to propagate after enabling new APIs.
*   **Data not appearing/updating**: Ensure your backend server is running and connected to the correct Firebase project. Check your browser's console for API errors.

