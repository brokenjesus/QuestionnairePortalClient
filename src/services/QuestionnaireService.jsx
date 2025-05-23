import axios from "axios";

const API_URL = 'http://localhost:8080/api/questionnaires';

const createQuestionnaire = async (questionnaireData, token) => {
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

const getAllQuestionnaires = async (token) => {
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

const updateQuestionnaire = async (id, questionnaireData, token) => {
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

const deleteQuestionnaire = async (id, token) => {
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
    updateQuestionnaire,
    deleteQuestionnaire
};