import axios from 'axios';

const API_URL = import.meta.env.VITE_BASE_URL + "/auth";

const token = sessionStorage.getItem('token') || localStorage.getItem('token');

export const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
};

export const signup = async (user) => {
    const response = await axios.post(`${API_URL}/signup`, user);
    return response.data;
};

export const updateProfile = async (profile) => {
    try {
        const response = await axios.put(
            `${API_URL}/profile`,
            {
                firstName: profile.firstName,
                lastName: profile.lastName,
                email: profile.email,
                phoneNumber: profile.phoneNumber
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to edit profile');
    }
};

export const changePassword = async (data) => {
    try {
        const response = await axios.put(
            `${API_URL}/change-password`,
            {
                currentPassword: data.currentPassword,
                newPassword: data.currentPassword
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to change password');
    }
};

export const forgotPassword = async (data) => {
    try {
        const response =
            await axios.put(
            `${API_URL}/forgot-password`,
            {
                email: data.email,
                newPassword: data.newPassword
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to change password');
    }
};

export const changePasswordSendVerificationCode = async () => {
    const response = await axios.get(
        `${API_URL}/change-password/send-verification-code`,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
    return response.data;
};

export const forgotPasswordSendVerificationCode = async (email) => {
    const response = await axios.post(
        `${API_URL}/forgot-password/send-verification-code`,
        {
            email: email,
        }
    );
    return response.data;
};

export const verifyEmail = async (email, code) => {
    const response = await axios.post(
        `${API_URL}/verify-email`,
        {
            email: email,
            code: code,
        }
    );
    return response.data;
};