import axios from "axios";

const API_URL = 'http://localhost:8080/api/questionnaires';
const token = sessionStorage.getItem('token') || localStorage.getItem('token');

const createQuestionnaire = async (questionnaireData) => {
    try {
        const response = await axios.post(
            API_URL,
            questionnaireData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to create questionnaire');
    }
};

const getAllQuestionnaires = async () => {
    try {
        const response = await axios.get(API_URL, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch questionnaires');
    }
};

const getAllQuestionnairesPageable = async (page, size) => {
    try {
        const response = await axios.get(API_URL+`?page=${page}&size=${size}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch questionnaires');
    }
};

const getQuestionnaireById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch questionnaire');
    }
};

const updateQuestionnaire = async (id, questionnaireData) => {
    try {
        const response = await axios.put(
            `${API_URL}/${id}`,
            questionnaireData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update questionnaire');
    }
};

const deleteQuestionnaire = async (id) => {
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
        throw new Error(error.response?.data?.message || 'Failed to delete questionnaire');
    }
};

export default {
    createQuestionnaire,
    getAllQuestionnaires,
    getAllQuestionnairesPageable,
    getQuestionnaireById,
    updateQuestionnaire,
    deleteQuestionnaire
};