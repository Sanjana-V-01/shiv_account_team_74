const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const collectionsToClear = [
  'products',
  'contacts',
  'purchaseOrders',
  'vendorBills',
  'customerInvoices'
];

const clearCollection = async (collectionName) => {
  const collectionRef = db.collection(collectionName);
  const snapshot = await collectionRef.get();

  if (snapshot.empty) {
    console.log(`Collection ${collectionName} is already empty.`);
    return;
  }

  const batch = db.batch();
  snapshot.docs.forEach(doc => {
    batch.delete(doc.ref);
  });

  await batch.commit();
  console.log(`Cleared ${snapshot.size} documents from ${collectionName}.`);
};

const clearAllData = async () => {
  console.log('Starting data clear...');
  for (const collectionName of collectionsToClear) {
    try {
      await clearCollection(collectionName);
    } catch (error) {
      console.error(`Error clearing collection ${collectionName}:`, error);
    }
  }
  console.log('Data clear finished.');
};

clearAllData();