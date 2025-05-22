import React, { useState } from 'react';
import { signup } from '../services/AuthService.jsx';

const SignUpForm = () => {
    const [form, setForm] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        phoneNumber: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const data = await signup(form);
            setMessage(data);
        } catch (err) {
            setMessage('Registration failed: ' + err.message);
        }
    };

    return (
        <form onSubmit={handleSignUp}>
            <div className="text-center mb-4">
                <h2><strong>LOGO</strong><span className="text-primary">TYPE</span></h2>
                <p className="text-muted">Sign Up</p>
            </div>

            <div className="mb-3">
                <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                />
            </div>

            <div className="mb-3">
                <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                />
            </div>

            <div className="mb-3">
                <input
                    type="password"
                    className="form-control"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    required
                />
            </div>

            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                />
            </div>

            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                />
            </div>

            <div className="mb-4">
                <input
                    type="tel"
                    className="form-control"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    placeholder="Phone Number"
                />
            </div>

            <div className="d-grid mb-3">
                <button type="submit" className="btn btn-primary">Sign Up</button>
            </div>

            {message && <p className={`text-center small ${message.includes('failed') ? 'text-danger' : 'text-success'}`}>{message}</p>}

            <div className="text-center">
                <span className="text-muted">Already have an account?</span> <a href="/login" className="text-primary">Log In</a>
            </div>
        </form>
    );
};

export default SignUpForm;