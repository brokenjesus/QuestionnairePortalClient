import React from 'react';
import SignUpForm from '../components/SignUpForm.jsx';

const SignUpPage = () => (
    <div className="d-flex justify-content-center align-items-center vw-100 vh-100 bg-light">
        <div className="p-5 bg-white rounded shadow" style={{ minWidth: '400px' }}>
            <SignUpForm />
        </div>
    </div>
);

export default SignUpPage;
