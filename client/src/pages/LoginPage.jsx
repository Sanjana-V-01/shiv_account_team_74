import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import api from '../api';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '', // Login with email now
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        const auth = getAuth();
        try {
            // Step 1: Sign in with Firebase Auth
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Step 2: Get the ID token
            const token = await user.getIdToken();
            localStorage.setItem('token', token);

            // Step 3: Fetch user role from your backend
            // We need to create this endpoint
            const res = await axios.get(`http://localhost:3001/api/users/${user.uid}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const userRole = res.data.role;
            localStorage.setItem('userRole', userRole);
            localStorage.setItem('userId', user.uid); // Store Firebase UID

            if (userRole === 'Contact') {
                navigate('/customer-portal');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            console.error("Login Error:", err);
            alert(err.message);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={onSubmit}>
                <div>
                    <input
                        type="email"
                        placeholder="Email Address"
                        name="email"
                        value={email}
                        onChange={onChange}
                        required
                    />
                </div>
                <div>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        required
                    />
                </div>
                <div>
                    <input type="checkbox" onChange={() => setShowPassword(!showPassword)} /> Show Password
                </div>
                <input type="submit" value="Login" />
            </form>
        </div>
    );
};

export default LoginPage;
