import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../services/AuthService.jsx';

const PasswordChangeForm = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const navigate = useNavigate();

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage({ text: 'New passwords do not match', type: 'danger' });
            return;
        }


        try {
            const token = localStorage.getItem('token');
            await changePassword({
                currentPassword,
                newPassword
            }, token);

            setMessage({
                text: 'Password changed successfully!',
                type: 'success'
            });

            // Опционально: перенаправление после успешной смены пароля
            setTimeout(() => navigate('/profile'), 2000);

        } catch (err) {
            setMessage({
                text: 'Password change failed: ' + err.message,
                type: 'danger'
            });
        }
    };

    return (
        <form onSubmit={handleChangePassword}>
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
                <button type="submit" className="btn btn-primary">Change Password</button>
            </div>

            {message.text && (
                <div className={`text-center small text-${message.type}`}>
                    {message.text}
                </div>
            )}

        </form>
    );
};

export default PasswordChangeForm;