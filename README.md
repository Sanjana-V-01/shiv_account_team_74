Find the video links in issues section

---

# Shiv Accounts Cloud

A **cloud-based accounting system** built for Shiv Furniture, enabling seamless management of sales, purchases, invoices, payments, and real-time financial reports.

---

## 🚀 Features

* **Master Data Management**

  * Contacts (Customers, Vendors, Both)
  * Products (Goods & Services with Tax & HSN details)
  * Taxes (Percentage/Fixed, applicable on Sales/Purchase)
  * Chart of Accounts (Assets, Liabilities, Income, Expenses, Equity)

* **Transactions**

  * Purchase Orders & Vendor Bills
  * Sales Orders & Customer Invoices
  * Payment Tracking (Cash/Bank)

* **Automated Reports**

  * Balance Sheet
  * Profit & Loss Statement
  * Inventory/Stock Report

---

## 👥 Primary Actors

* **Admin (Business Owner)** – Manage master data, record transactions, view reports
* **Invoicing User (Accountant)** – Create master data, record transactions, view reports
* **Contact (Customer/Vendor)** – View own invoices/bills, make payments
* **System** – Validates, computes taxes, updates ledgers, generates reports

---

## 🛠️ Master Data Modules

* **Contact Master** → Name, Type, Email, Mobile, Address, Profile Image
* **Product Master** → Product Name, Type, Sales/Purchase Price, Tax %, HSN, Category
* **Tax Master** → Tax Name, Computation (Percentage/Fixed), Sales/Purchase applicability
* **Chart of Accounts** → Categorization of transactions into Assets, Liabilities, Income, Expenses, Equity

---

## 🔄 Transaction Flow

1. **Purchase Order** → Select Vendor, Product, Quantity, Unit Price, Tax
2. **Vendor Bill** → Convert PO to Bill, record invoice & payment
3. **Sales Order** → Select Customer, Product, Quantity, Unit Price, Tax
4. **Customer Invoice** → Generate invoice, apply tax, register payment
5. **Payment** → Record against bill/invoice via Cash/Bank

---

## 📊 Reporting

* **Balance Sheet** → Real-time Assets, Liabilities, Equity
* **Profit & Loss** → Income vs Expenses (Net Profit)
* **Stock Report** → Product quantity, valuation, movement

---

## ✅ Example Use Case

1. Add Contacts (e.g., *Azure Furniture* as Vendor, *Nimesh Pathak* as Customer)
2. Add Products (e.g., *Wooden Chair* with 5% Sales Tax)
3. Create Purchase Order → Convert to Vendor Bill → Register Payment
4. Create Sales Order → Convert to Invoice → Record Customer Payment
5. View Balance Sheet, P\&L, and Stock Report in real-time

---

## 📌 Tech Stack

* **Frontend**: React.js / Next.js
* **Backend**: Node.js + Express
* **Database**: Firebase Firestore / PostgreSQL
* **Authentication**: Firebase Auth / JWT
* **Cloud Functions**: For stock updates & cascading deletes

---

⚡ *Shiv Accounts Cloud simplifies accounting by automating invoices, payments, and financial reporting – saving time and ensuring accuracy.*

---
