import React, { useState, useEffect } from 'react';
import { updateProfile } from '../services/AuthService.jsx';
import Navbar from '../components/Navbar.jsx';
import ProfileForm from '../components/ProfileForm.jsx';
import PasswordChangeForm from "../components/PasswordChangeForm.jsx";

const ProfilePage = () => {
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login';
            return;
        }

        setProfile({
            firstName: localStorage.getItem('firstName') || '',
            lastName: localStorage.getItem('lastName') || '',
            email: localStorage.getItem('email') || '',
            phoneNumber: localStorage.getItem('phoneNumber') || ''
        });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No authentication token found');

            await updateProfile(profile, token);

            localStorage.setItem('firstName', profile.firstName);
            localStorage.setItem('lastName', profile.lastName);
            localStorage.setItem('phoneNumber', profile.phoneNumber);

            setSuccess('Profile updated successfully');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="d-flex justify-content-center align-items-center vw-100 vh-100 bg-light">
                <ProfileForm
                    profile={profile}
                    loading={loading}
                    error={error}
                    success={success}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                />
            </div>
        </>
    );
};

export default ProfilePage;