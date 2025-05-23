import React, { useState } from 'react';
import { verifyEmail } from '../services/AuthService.jsx';

const VerificationModal = ({ email, onSuccess, onClose }) => {
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const success = await verifyEmail(email, code);
            if (success) {
                onSuccess();
            } else {
                setMessage('Invalid verification code or code has expired.');
            }
        } catch (err) {
            setMessage('Verification failed: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Email Verification</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <p>We've sent a 6-digit verification code to {email}. Please enter it below:</p>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder="Enter verification code"
                                    maxLength="6"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Verifying...' : 'Verify Email'}
                            </button>
                        </form>
                        {message && (
                            <div className={`mt-3 alert ${message.includes('failed') ? 'alert-danger' : 'alert-warning'}`}>
                                {message}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerificationModal;