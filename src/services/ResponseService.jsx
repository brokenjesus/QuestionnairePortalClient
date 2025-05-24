import axios from "axios";

const API_URL = import.meta.env.VITE_BASE_URL;
const token = sessionStorage.getItem('token') || localStorage.getItem('token');

const submitResponse = async (responseData) => {
    try {
        const response = await axios.post(
            API_URL+`/questionnaires/${responseData.questionnaireId}/response`,
            responseData
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to submit response');
    }
};

const getResponseById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/responses/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch response');
    }
};

export default {
    submitResponse,
    getResponseById
};