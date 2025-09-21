import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';
import api from '../api';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); // Clear error when user types
    };

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const token = await user.getIdToken();
            localStorage.setItem('token', token);

            const res = await api.get(`/users/${user.uid}`);
            const userRole = res.data.role;
            localStorage.setItem('userRole', userRole);
            localStorage.setItem('userId', user.uid);

            if (userRole === 'Contact') {
                navigate('/customer-portal');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            console.error("Login Error:", err);
            // More user-friendly error messages
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                setError('Invalid email or password.');
            } else if (err.code === 'auth/too-many-requests') {
                setError('Too many login attempts. Please try again later.');
            } else {
                setError(err.message || 'An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container} className="auth-container">
            <div style={styles.card} className="auth-card">
                <div style={styles.header}>
                    <div style={styles.logo} className="auth-logo">
                        <div style={styles.logoIcon}>📊</div>
                        <h1 style={styles.title} className="auth-title">Shiv Accounts</h1>
                    </div>
                    <p style={styles.subtitle} className="auth-subtitle">Welcome back! Please sign in to your account</p>
                </div>

                <form onSubmit={onSubmit} style={styles.form} className="auth-form">
                    {error && (
                        <div style={styles.errorAlert} className="auth-alert">
                            <span style={styles.errorIcon}>⚠️</span>
                            {error}
                        </div>
                    )}

                    <div style={styles.inputGroup}>
                        <label style={styles.label} className="auth-label">Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            name="email"
                            value={email}
                            onChange={onChange}
                            required
                            style={styles.input}
                            className="auth-input"
                            disabled={loading}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label} className="auth-label">Password</label>
                        <div style={styles.passwordContainer}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                name="password"
                                value={password}
                                onChange={onChange}
                                required
                                style={styles.input}
                                className="auth-input"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={styles.passwordToggle}
                                disabled={loading}
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>

                    <div style={styles.checkboxContainer}>
                        <label style={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={showPassword}
                                onChange={() => setShowPassword(!showPassword)}
                                style={styles.checkbox}
                                disabled={loading}
                            />
                            <span style={styles.checkboxText}>Show password</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`auth-button ${loading ? 'auth-loading' : ''}`}
                        style={{
                            ...styles.submitButton,
                            ...(loading ? styles.submitButtonDisabled : {})
                        }}
                    >
                        {loading ? (
                            <>
                                <span style={styles.spinner}>⏳</span>
                                Signing in...
                            </>
                        ) : (
                            <>
                                <span style={styles.buttonIcon}>🔑</span>
                                Sign In
                            </>
                        )}
                    </button>
                </form>

                <div style={styles.footer}>
                    <p style={styles.footerText} className="auth-footer-text">
                        Don't have an account?{' '}
                        <Link to="/signup" style={styles.link}>
                            Sign up here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    card: {
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        position: 'relative',
        overflow: 'hidden'
    },
    header: {
        textAlign: 'center',
        marginBottom: '30px'
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        marginBottom: '10px'
    },
    logoIcon: {
        fontSize: '32px'
    },
    title: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#2d3748',
        margin: '0'
    },
    subtitle: {
        color: '#718096',
        fontSize: '16px',
        margin: '0'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    errorAlert: {
        background: '#fed7d7',
        color: '#c53030',
        padding: '12px 16px',
        borderRadius: '8px',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        border: '1px solid #feb2b2'
    },
    errorIcon: {
        fontSize: '16px'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
    },
    label: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#4a5568'
    },
    input: {
        padding: '12px 16px',
        border: '2px solid #e2e8f0',
        borderRadius: '10px',
        fontSize: '16px',
        transition: 'all 0.2s ease',
        outline: 'none',
        background: '#f7fafc'
    },
    passwordContainer: {
        position: 'relative'
    },
    passwordToggle: {
        position: 'absolute',
        right: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '18px',
        padding: '4px',
        borderRadius: '4px',
        transition: 'background 0.2s ease'
    },
    checkboxContainer: {
        display: 'flex',
        alignItems: 'center'
    },
    checkboxLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        fontSize: '14px'
    },
    checkbox: {
        width: '16px',
        height: '16px',
        accentColor: '#667eea'
    },
    checkboxText: {
        color: '#4a5568'
    },
    submitButton: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        padding: '14px 24px',
        borderRadius: '10px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        marginTop: '10px'
    },
    submitButtonDisabled: {
        opacity: '0.7',
        cursor: 'not-allowed'
    },
    buttonIcon: {
        fontSize: '16px'
    },
    spinner: {
        animation: 'spin 1s linear infinite'
    },
    footer: {
        textAlign: 'center',
        marginTop: '30px',
        paddingTop: '20px',
        borderTop: '1px solid #e2e8f0'
    },
    footerText: {
        color: '#718096',
        fontSize: '14px',
        margin: '0'
    },
    link: {
        color: '#667eea',
        textDecoration: 'none',
        fontWeight: '600',
        transition: 'color 0.2s ease'
    }
};

export default LoginPage;