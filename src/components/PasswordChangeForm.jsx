import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword, changePasswordSendVerificationCode } from '../services/AuthService.jsx';
import VerificationModal from './VerificationModal.jsx';

const PasswordChangeForm = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState(''); // Добавляем состояние для email
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage({ text: 'New passwords do not match', type: 'danger' });
            return;
        }

        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            // Получаем email из токена или другого места
            const userEmail = localStorage.getItem('email') || '';
            setEmail(userEmail);

            await changePasswordSendVerificationCode(token);
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

    const handleVerificationComplete = async (verificationCode) => {
        try {
            const token = localStorage.getItem('token');
            console.log("Sending change password request with:", {
                currentPassword,
                newPassword,
                verificationCode
            });

            const response = await changePassword({
                currentPassword,
                newPassword,
                verificationCode
            }, token);

            console.log("Change password response:", response);

            setMessage({
                text: 'Password changed successfully!',
                type: 'success'
            });
            setShowVerificationModal(false);
            setTimeout(() => navigate('/profile'), 2000);
        } catch (err) {
            console.error("Password change error:", err);
            setMessage({
                text: 'Password change failed: ' + (err.response?.data?.message || err.message),
                type: 'danger'
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="text-center mb-4">
                <h4 className="mb-4 text-start pb-2 border-bottom">Edit Profile</h4>
            </div>

            <div className="mb-3">
                <input
                    type="password"
                    className="form-control"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
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
                    {isLoading ? 'Sending Code...' : 'Change Password'}
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

export default PasswordChangeForm;