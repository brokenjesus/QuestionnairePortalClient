import React from 'react';
import LoginForm from '../components/LoginForm.jsx';

const LoginPage = () => (
    <div className="d-flex justify-content-center align-items-center vw-100 vh-100 bg-light">
        <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
            <LoginForm />
        </div>
    </div>
);

export default LoginPage;
