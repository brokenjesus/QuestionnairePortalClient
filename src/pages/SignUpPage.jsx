import React from 'react';
import SignUpForm from '../components/SignUpForm.jsx';

const SignUpPage = () => (
    <div className="d-flex justify-content-center align-items-center bg-light position-fixed top-0 start-0 w-100 h-100">
        <div className="p-5 bg-white rounded shadow" style={{ minWidth: '400px' }}>
            <SignUpForm />
        </div>
    </div>
);

export default SignUpPage;
