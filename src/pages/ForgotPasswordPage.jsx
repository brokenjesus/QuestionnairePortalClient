import React from 'react';
import ForgotPasswordForm from '../components/ForgotPasswordForm.jsx';
import Navbar from "../components/Navbar.jsx";

const ForgotPasswordPage = () => {
    return (
        <>
            <Navbar />
            <div className="d-flex justify-content-center align-items-center vw-100 vh-100 bg-light">
                <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
                    <ForgotPasswordForm />
                </div>
            </div>
        </>
    );
};

export default ForgotPasswordPage;