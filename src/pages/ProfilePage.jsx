import React, { useState, useEffect } from 'react';
import { updateProfile } from '../services/AuthService.jsx';
import Header from '../components/Header.jsx';
import ProfileForm from '../components/ProfileForm.jsx';

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
        const token = sessionStorage.getItem('token') || localStorage.getItem('token');

        if (!token) {
            window.location.href = '/login';
            return;
        }

        setProfile({
            firstName: sessionStorage.getItem('firstName') || localStorage.getItem('firstName') || '',
            lastName: sessionStorage.getItem('lastName') || localStorage.getItem('lastName') || '',
            email: sessionStorage.getItem('email') || localStorage.getItem('email') || '',
            phoneNumber:sessionStorage.getItem('phoneNumber') ||  localStorage.getItem('phoneNumber') || ''
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
            await updateProfile(profile);

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
            <Header />
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