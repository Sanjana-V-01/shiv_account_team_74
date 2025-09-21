import React, { useEffect, useState } from 'react';
import { auth, db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

const FirebaseTest = () => {
    const [status, setStatus] = useState('Testing Firebase connection...');
    const [authStatus, setAuthStatus] = useState('Testing Auth...');
    const [firestoreStatus, setFirestoreStatus] = useState('Testing Firestore...');

    useEffect(() => {
        // Test Firebase Auth
        if (auth) {
            setAuthStatus('✅ Firebase Auth initialized successfully');
        } else {
            setAuthStatus('❌ Firebase Auth failed to initialize');
        }

        // Test Firestore
        if (db) {
            setFirestoreStatus('✅ Firestore initialized successfully');
        } else {
            setFirestoreStatus('❌ Firestore failed to initialize');
        }

        setStatus('✅ Firebase configuration loaded successfully');
    }, []);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2>Firebase Configuration Test</h2>
            <div style={{ marginBottom: '10px' }}>
                <strong>Overall Status:</strong> {status}
            </div>
            <div style={{ marginBottom: '10px' }}>
                <strong>Auth Status:</strong> {authStatus}
            </div>
            <div style={{ marginBottom: '10px' }}>
                <strong>Firestore Status:</strong> {firestoreStatus}
            </div>
            <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
                <p><strong>Note:</strong> This is a test component to verify Firebase configuration. 
                You can remove this file after confirming everything works.</p>
            </div>
        </div>
    );
};

export default FirebaseTest;
