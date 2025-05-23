import React from 'react';
import PasswordChangeForm from '../components/PasswordChangeForm.jsx';
import Navbar from "../components/Navbar.jsx";

const PasswordChangePage = () => {
    return (
        <>
            <Navbar />
            <div className="d-flex justify-content-center align-items-center vw-100 vh-100 bg-light">
                <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
                    <PasswordChangeForm />
                </div>
            </div>
        </>
    );
};

export default PasswordChangePage;
