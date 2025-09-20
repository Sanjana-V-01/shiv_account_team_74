import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import api from '../api';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        loginId: '',
        email: '',
        password: '',
        reenterPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const { name, loginId, email, password, reenterPassword } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        if (password !== reenterPassword) {
            alert('Passwords do not match');
            return;
        }

        const auth = getAuth();
        try {
            // Step 1: Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Step 2: Save additional user info to your backend (which saves to Firestore)
            const newUser = { name, loginId, email }; // Password is not sent
            await axios.post('http://localhost:3001/api/auth/register', newUser);

            alert('User registered successfully.');
            navigate('/login');

        } catch (error) {
            // Handle errors from Firebase Auth or your backend
            console.error("Signup Error:", error);
            alert(error.message);
        }
    };

    return (
        <div>
            <h2>Sign Up</h2>
            <form onSubmit={onSubmit}>
                <div>
                    <input
                        type="text"
                        placeholder="Name"
                        name="name"
                        value={name}
                        onChange={onChange}
                        required
                    />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Login ID"
                        name="loginId"
                        value={loginId}
                        onChange={onChange}
                        required
                    />
                </div>
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
                        minLength="6"
                        required
                    />
                     <small>Password must be at least 6 characters.</small>
                </div>
                <div>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Re-enter Password"
                        name="reenterPassword"
                        value={reenterPassword}
                        onChange={onChange}
                        minLength="6"
                        required
                    />
                </div>
                 <div>
                    <input type="checkbox" onChange={() => setShowPassword(!showPassword)} /> Show Password
                </div>
                <input type="submit" value="Register" />
            </form>
        </div>
    );
};

export default SignupPage;
