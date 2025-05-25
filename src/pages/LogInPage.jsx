import React from 'react';
import LogInForm from '../components/LogInForm.jsx';

const LogInPage = () => (
    <div className="d-flex justify-content-center align-items-center vw-100 vh-100 bg-light">
        <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
            <LogInForm />
        </div>
    </div>
);

export default LogInPage;
