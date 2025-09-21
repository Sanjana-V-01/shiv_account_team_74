import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

    const { name, loginId, email, password, reenterPassword } = formData;

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); // Clear error when user types
        setSuccess(''); // Clear success message when user types
    };

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (password !== reenterPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            // Step 1: Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Step 2: Save additional user info to your backend (which saves to Firestore)
            const newUser = { name, loginId, email }; // Password is not sent
            await api.post('/auth/register', newUser);

            setSuccess('Account created successfully! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            console.error("Signup Error:", err);
            if (err.code === 'auth/email-already-in-use') {
                setError('The email address is already in use by another account.');
            } else if (err.code === 'auth/invalid-email') {
                setError('The email address is not valid.');
            } else if (err.code === 'auth/weak-password') {
                setError('The password is too weak. Please choose a stronger password.');
            } else {
                setError(err.message || 'An unexpected error occurred during signup.');
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
                    <p style={styles.subtitle} className="auth-subtitle">Create your account to get started</p>
                </div>

                <form onSubmit={onSubmit} style={styles.form} className="auth-form">
                    {error && (
                        <div style={styles.errorAlert} className="auth-alert">
                            <span style={styles.errorIcon}>⚠️</span>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div style={styles.successAlert} className="auth-alert">
                            <span style={styles.successIcon}>✅</span>
                            {success}
                        </div>
                    )}

                    <div style={styles.inputGroup}>
                        <label style={styles.label} className="auth-label">Full Name</label>
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            name="name"
                            value={name}
                            onChange={onChange}
                            required
                            style={styles.input}
                            className="auth-input"
                            disabled={loading}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label} className="auth-label">Login ID</label>
                        <input
                            type="text"
                            placeholder="Choose a unique login ID"
                            name="loginId"
                            value={loginId}
                            onChange={onChange}
                            required
                            style={styles.input}
                            className="auth-input"
                            disabled={loading}
                        />
                    </div>

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
                                placeholder="Create a strong password"
                                name="password"
                                value={password}
                                onChange={onChange}
                                minLength="6"
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
                        <small style={styles.helpText}>Password must be at least 6 characters long</small>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label} className="auth-label">Confirm Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Re-enter your password"
                            name="reenterPassword"
                            value={reenterPassword}
                            onChange={onChange}
                            minLength="6"
                            required
                            style={styles.input}
                            className="auth-input"
                            disabled={loading}
                        />
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
                            <span style={styles.checkboxText}>Show passwords</span>
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
                                Creating account...
                            </>
                        ) : (
                            <>
                                <span style={styles.buttonIcon}>🚀</span>
                                Create Account
                            </>
                        )}
                    </button>
                </form>

                <div style={styles.footer}>
                    <p style={styles.footerText} className="auth-footer-text">
                        Already have an account?{' '}
                        <Link to="/login" style={styles.link}>
                            Sign in here
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
        maxWidth: '450px',
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
    successAlert: {
        background: '#c6f6d5',
        color: '#2f855a',
        padding: '12px 16px',
        borderRadius: '8px',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        border: '1px solid #9ae6b4'
    },
    errorIcon: {
        fontSize: '16px'
    },
    successIcon: {
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
    helpText: {
        fontSize: '12px',
        color: '#718096',
        marginTop: '4px'
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

export default SignupPage;