import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        loginId: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const { loginId, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:3001/api/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard');
        } catch (err) {
            alert(err.response.data.message);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={onSubmit}>
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