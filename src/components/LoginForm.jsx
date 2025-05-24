import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/AuthService.jsx';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const data = await login(email, password);

            const storage = rememberMe ? localStorage : sessionStorage;

            storage.setItem('token', data.token);
            storage.setItem('email', data.email);
            storage.setItem('firstName', data.firstName);
            storage.setItem('lastName', data.lastName);
            storage.setItem('phoneNumber', data.phoneNumber);

            navigate('/');
        } catch (err) {
            setMessage('Login failed: ' + err.message + '\nCheck credentials.');
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <div className="text-center mb-4">
                <h2><strong>LOGO</strong><span className="text-primary">TYPE</span></h2>
                <p className="text-muted">Log In</p>
            </div>

            <div className="mb-3">
                <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div className="mb-3">
                <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                    />
                    <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                </div>
                <a href="/forgot-password" className="text-primary small">Forgot your password?</a>
            </div>

            <div className="d-grid mb-3">
                <button type="submit" className="btn btn-primary">Log In</button>
            </div>

            {message && <p className="text-center text-danger small">{message}</p>}

            <div className="text-center">
                <span className="text-muted">Don’t have an account?</span> <a href="/signup" className="text-primary">Sign Up</a>
            </div>
        </form>
    );
};

export default LoginForm;
