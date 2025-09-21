import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from './firebase';

const TestSignup = () => {
    const [formData, setFormData] = useState({
        email: 'test@example.com',
        password: 'password123'
    });
    const [result, setResult] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();
        setResult('Creating user...');
        
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            setResult(`✅ User created successfully! UID: ${userCredential.user.uid}`);
        } catch (error) {
            setResult(`❌ Error: ${error.message}`);
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px', borderRadius: '8px' }}>
            <h3>Test User Creation</h3>
            <form onSubmit={handleSignup}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Email: </label>
                    <input 
                        type="email" 
                        value={formData.email} 
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        style={{ padding: '5px', marginLeft: '10px' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Password: </label>
                    <input 
                        type="password" 
                        value={formData.password} 
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        style={{ padding: '5px', marginLeft: '10px' }}
                    />
                </div>
                <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
                    Create Test User
                </button>
            </form>
            {result && (
                <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                    {result}
                </div>
            )}
        </div>
    );
};

export default TestSignup;
