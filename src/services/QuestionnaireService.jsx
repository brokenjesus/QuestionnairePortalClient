import axios from "axios";

const API_URL = import.meta.env.VITE_BASE_URL + "/questionnaires";
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

const getAllMyQuestionnaires = async () => {
    try {
        const response = await axios.get(API_URL+"/my", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch questionnaires');
    }
};

const getAllMyQuestionnairesPageable = async (page, size) => {
    try {
        const response = await axios.get(API_URL+`/my?page=${page}&size=${size}`, {
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
        const response = await axios.get(API_URL+`/all?page=${page}&size=${size}`);
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
    getAllMyQuestionnaires,
    getAllMyQuestionnairesPageable,
    getAllQuestionnairesPageable,
    getQuestionnaireById,
    updateQuestionnaire,
    deleteQuestionnaire
};