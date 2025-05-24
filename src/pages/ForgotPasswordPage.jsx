import React from 'react';
import ForgotPasswordForm from '../components/ForgotPasswordForm.jsx';
import Header from "../components/Header.jsx";

const ForgotPasswordPage = () => {
    return (
        <>
            <Header />
            <div className="d-flex justify-content-center align-items-center vw-100 vh-100 bg-light">
                <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
                    <ForgotPasswordForm />
                </div>
            </div>
        </>
    );
};

export default ForgotPasswordPage;