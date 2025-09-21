Here’s a **professional, polished README.md** for your project **Shiv Accounts** — concise, structured, and developer-friendly:

---

# Shiv Accounts

**Shiv Accounts** is a cloud-based accounting and inventory management system built to streamline business operations. It automates bookkeeping, manages sales and purchase workflows, updates stock in real time, and generates essential financial reports — all within a secure, role-based environment.

---

## ✨ Key Features

* **User Authentication** – Secure login & registration via Firebase Authentication.
* **Master Data Management** – CRUD operations for Customers, Vendors, Products, Taxes, and Accounts.
* **Sales Workflow** – Sales Orders → Invoices → Receipts with automated stock updates.
* **Purchase Workflow** – Purchase Orders → Vendor Bills → Payments with cascading deletes.
* **Reports & Insights** – Real-time Profit & Loss, Balance Sheet, Inventory Report, and Dashboard.
* **Role-Based Access** – Admin, Accountant, and Customer/Vendor portal with tailored permissions.
* **Cloud Functions** – Automated tasks such as cascading deletes and stock adjustments.

---

## 🛠️ Tech Stack

* **Frontend**: React (Vite)
* **Backend**: Node.js + Express.js
* **Database**: Google Firestore (Native Mode)
* **Authentication**: Firebase Authentication
* **Server Logic**: Firebase Cloud Functions

---

## 🚀 Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) v16+
* [npm](https://www.npmjs.com/)
* SQLlite for database management

### Installation

1. **Clone the Repository**

   ```sh
   git clone https://github.com/<your-username>/shiv_accounts.git
   cd shiv_accounts
   ```

2. **Install Dependencies**

   ```sh
   cd server && npm install
   cd ../client && npm install
   ```

3. **Configure Firebase**

   * Add your Firebase web config to `client/src/firebase.js`
   * Place your service account key as `server/firebase-service-account.json` (ignored by Git)

4. **Run the Application**

   * Start backend:

     ```sh
     cd server
     node index.js
     ```
   * Start frontend:

     ```sh
     cd ../client
     npm run dev
     ```
   * Open the provided URL (default: `http://localhost:5173`)

---

## 📊 Business Value

Shiv Accounts provides:

* **Automation** – Eliminates manual bookkeeping and reduces errors
* **Scalability** – Designed for growing businesses with multi-user support
* **Insights** – Real-time financial and inventory health at your fingertips

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to open a Pull Request or raise an Issue in the repository.




