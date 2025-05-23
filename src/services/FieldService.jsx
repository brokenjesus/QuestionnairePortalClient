import axios from "axios";

const API_URL = 'http://localhost:8080/api/fields';

const getAllFields = async (page = 0, size = 10, token) => {
    try {
        const response = await axios.get(API_URL+`?page=${page}&size=${size}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch fields');
    }
};

const getActiveFields = async (token) => {
    try {
        const response = await axios.get(API_URL+`/active`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch active fields');
    }
}


const createField = async (fieldData, token) => {
    try {
        const response = await axios.post(
            API_URL,
            fieldData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to create field');
    }
};

const deleteField = async (id, token) => {
    try {
        await axios.delete(
            `${API_URL}/${id}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete field');
    }
};

const updateField = async (id, fieldData, token) => {
    try {
        const response = await axios.put(
            `${API_URL}/${id}`,
            fieldData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update field');
    }
};

// Добавляем в экспорт
export default {
    getAllFields,
    getActiveFields,
    createField,
    deleteField,
    updateField
};