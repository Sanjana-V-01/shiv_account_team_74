/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/v2/https");
const {onDocumentDeleted, onDocumentCreated} = require("firebase-functions/v2/firestore");
const {logger} = require("firebase-functions/v2");
const admin = require("firebase-admin");

admin.initializeApp(); // Initialize Firebase Admin SDK

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// --- Cloud Functions for Cascading Deletes ---

// Function to delete associated Vendor Bills when a Purchase Order is deleted
exports.onDeletePurchaseOrder = onDocumentDeleted('purchaseOrders/{purchaseOrderId}', async (event) => {
    const purchaseOrderId = event.params.purchaseOrderId;
    logger.info(`Deleting Purchase Order: ${purchaseOrderId}`);

    const vendorBillsRef = admin.firestore().collection('vendorBills');
    const snapshot = await vendorBillsRef.where('purchaseOrderId', '==', purchaseOrderId).get();

    const deletePromises = [];
    snapshot.forEach(doc => {
        deletePromises.push(doc.ref.delete());
    });

    await Promise.all(deletePromises);
    logger.info(`Deleted ${deletePromises.length} vendor bills for Purchase Order: ${purchaseOrderId}`);
    return null;
});

// Function to delete associated Customer Invoices when a Sales Order is deleted
exports.onDeleteSalesOrder = onDocumentDeleted('salesOrders/{salesOrderId}', async (event) => {
    const salesOrderId = event.params.salesOrderId;
    logger.info(`Deleting Sales Order: ${salesOrderId}`);

    const customerInvoicesRef = admin.firestore().collection('customerInvoices');
    const snapshot = await customerInvoicesRef.where('salesOrderId', '==', salesOrderId).get();

    const deletePromises = [];
    snapshot.forEach(doc => {
        deletePromises.push(doc.ref.delete());
    });

    await Promise.all(deletePromises);
    logger.info(`Deleted ${deletePromises.length} customer invoices for Sales Order: ${salesOrderId}`);
    return null;
});

// --- Cloud Function to update stock on Purchase Order creation ---
exports.onCreatePurchaseOrderUpdateStock = onDocumentCreated('purchaseOrders/{purchaseOrderId}', async (event) => {
    const purchaseOrderData = event.data.data();
    logger.info(`New Purchase Order created: ${event.params.purchaseOrderId}`);

    const productUpdates = [];
    for (const item of purchaseOrderData.items) {
        const productId = item.productId;
        const quantity = item.quantity;

        if (productId && quantity) {
            const productRef = admin.firestore().collection('products').doc(productId);
            productUpdates.push(productRef.update({
                currentStock: admin.firestore.FieldValue.increment(quantity)
            }));
        }
    }

    await Promise.all(productUpdates);
    logger.info(`Stock updated for products in Purchase Order: ${event.params.purchaseOrderId}`);
    return null;
});

// --- Cloud Function to update stock on Sales Order creation ---
exports.onCreateSalesOrderDecreaseStock = onDocumentCreated('salesOrders/{salesOrderId}', async (event) => {
    const salesOrderData = event.data.data();
    logger.info(`New Sales Order created: ${event.params.salesOrderId}`);

    const productUpdates = [];
    for (const item of salesOrderData.items) {
        const productId = item.productId;
        const quantity = item.quantity;

        if (productId && quantity) {
            const productRef = admin.firestore().collection('products').doc(productId);
            productUpdates.push(productRef.update({
                currentStock: admin.firestore.FieldValue.increment(-quantity) // Decrement stock
            }));
        }
    }

    await Promise.all(productUpdates);
    logger.info(`Stock updated for products in Sales Order: ${event.params.salesOrderId}`);
    return null;
});
