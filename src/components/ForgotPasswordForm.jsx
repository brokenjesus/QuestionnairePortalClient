import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPasswordSendVerificationCode, forgotPassword } from '../services/AuthService.jsx';
import VerificationModal from './VerificationModal.jsx';

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage({ text: 'New passwords do not match', type: 'danger' });
            return;
        }

        setIsLoading(true);
        try {
            console.log(email);
            await forgotPasswordSendVerificationCode(email);
            setShowVerificationModal(true);
        } catch (err) {
            setMessage({
                text: 'Failed to send verification code: ' + err.message,
                type: 'danger'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerificationComplete = async () => {
        try {
            const response = await forgotPassword({
                email,
                newPassword
            });

            console.log("Forgot password response:", response);

            setMessage({
                text: 'Password reset successfully!',
                type: 'success'
            });
            setShowVerificationModal(false);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            console.error("Password reset error:", err);
            setMessage({
                text: 'Password reset failed: ' + (err.response?.data?.message || err.message),
                type: 'danger'
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="text-center mb-4">
                <h4 className="mb-4 text-start pb-2 border-bottom">Password Reset</h4>
            </div>

            <div className="mb-3">
                <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div className="mb-3">
                <input
                    type="password"
                    className="form-control"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
            </div>

            <div className="mb-3">
                <input
                    type="password"
                    className="form-control"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
            </div>

            <div className="d-grid mb-3">
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                >
                    {isLoading ? 'Sending Code...' : 'Reset Password'}
                </button>
            </div>

            {message.text && (
                <div className={`text-center small text-${message.type}`}>
                    {message.text}
                </div>
            )}

            {showVerificationModal && (
                <VerificationModal
                    email={email}
                    onSuccess={handleVerificationComplete}
                    onClose={() => setShowVerificationModal(false)}
                />
            )}
        </form>
    );
};

export default ForgotPasswordForm;