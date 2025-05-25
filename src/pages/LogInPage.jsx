import React from 'react';
import LogInForm from '../components/LogInForm.jsx';

const LogInPage = () => (
    <div className="d-flex justify-content-center align-items-center bg-light position-fixed top-0 start-0 w-100 h-100">
        <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
            <LogInForm />
        </div>
    </div>
);

export default LogInPage;
