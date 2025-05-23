import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

export const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
};

export const signup = async (user) => {
    const response = await axios.post(`${API_URL}/signup`, user);
    return response.data;
};

export const updateProfile = async (profile, token) => {
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

export const changePassword = async (passwordData, token) => {
    try {
        const response = await axios.post(
            `${API_URL}/change-password`,
            {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
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