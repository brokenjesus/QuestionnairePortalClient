import React, { useState, useEffect } from 'react';
import Header from '../components/Header.jsx';
import Pagination from '../components/Pagination';
import QuestionnaireService from '../services/QuestionnaireService.jsx';
import QuestionnaireForm from '../components/QuestionnaireForm.jsx';

const AllMyQuestionnairesPage = () => {
    const [questionnaires, setQuestionnaires] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingQuestionnaire, setEditingQuestionnaire] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const pageSize = 10;

    useEffect(() => {
        const fetchQuestionnaires = async () => {
            try {
                setIsLoading(true);
                const response = await QuestionnaireService.getAllMyQuestionnairesPageable(currentPage - 1, pageSize);
                setQuestionnaires(response.content || []);
                setTotalPages(response.totalPages ?? 1);
                setTotalItems(response.totalElements ?? 0);
                setError(null);
            } catch (err) {
                console.error("Error loading questionnaires:", err);
                setError('Failed to load questionnaires');
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuestionnaires();
    }, [currentPage]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleCreateQuestionnaire = async (questionnaireData) => {
        try {
            await QuestionnaireService.createQuestionnaire(questionnaireData);
            setShowModal(false);
            setCurrentPage(1);
            setTimeout(() => window.location.reload(), 500);
        } catch (error) {
            console.error("Error creating questionnaire:", error);
            setError('Failed to create questionnaire');
        }
    };

    const handleUpdateQuestionnaire = async (questionnaireData) => {
        try {
            const updated = await QuestionnaireService.updateQuestionnaire(
                editingQuestionnaire.id,
                questionnaireData,
            );
            setQuestionnaires(prev =>
                prev.map(q => q.id === updated.id ? updated : q)
            );
            setShowModal(false);
            setEditingQuestionnaire(null);
            setTimeout(() => window.location.reload(), 500);
        } catch (error) {
            console.error("Error updating questionnaire:", error);
            setError('Failed to update questionnaire');
        }
    };

    const handleDeleteQuestionnaire = async (id) => {
        if (!window.confirm('Are you sure you want to delete this questionnaire?')) return;

        try {
            await QuestionnaireService.deleteQuestionnaire(id);
            setCurrentPage(1);
            setTimeout(() => window.location.reload(), 500);
        } catch (error) {
            console.error("Error deleting questionnaire:", error);
            setError('Failed to delete questionnaire');
        }
    };

    const handleEditClick = (questionnaire) => {
        setEditingQuestionnaire(questionnaire);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingQuestionnaire(null);
    };

    if (isLoading) {
        return (
            <>
                <Header />
                <div className="container mt-4">
                    <div className="d-flex justify-content-center">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header />
                <div className="container mt-4">
                    <div className="alert alert-danger">
                        {error}
                        <button
                            className="btn btn-sm btn-outline-danger ms-2"
                            onClick={() => window.location.reload()}
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="container mt-4">
                <div className="d-flex justify-content-between mb-3">
                    <h2>Your Questionnaires</h2>
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            setEditingQuestionnaire(null);
                            setShowModal(true);
                        }}
                    >
                        + Create Questionnaire
                    </button>
                </div>

                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead className="table-light">
                        <tr>
                            <th style={{ width: '10%' }}>Id</th>
                            <th style={{ width: '15%' }}>Name</th>
                            <th style={{ width: '40%' }}>Description</th>
                            <th style={{ width: '20%' }}>Fields Count</th>
                            <th style={{ width: '15%' }}>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {questionnaires.length > 0 ? (
                            questionnaires.map(questionnaire => (
                                <tr key={questionnaire.id}>
                                    <td>{questionnaire.id}</td>
                                    <td>{questionnaire.name}</td>
                                    <td>{questionnaire.description}</td>
                                    <td>{questionnaire.fields?.length || 0}</td>
                                    <td>
                                        <div className="d-flex gap-2 justify-content-between">
                                            <button
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={() => handleEditClick(questionnaire)}
                                            >
                                                ✎ Edit
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleDeleteQuestionnaire(questionnaire.id)}
                                            >
                                                ❌ Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center text-muted">
                                    No questionnaires found. Create your first questionnaire.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    onPageChange={handlePageChange}
                />

                {showModal && (
                    <QuestionnaireForm
                        onClose={handleCloseModal}
                        onSubmit={editingQuestionnaire ? handleUpdateQuestionnaire : handleCreateQuestionnaire}
                        initialData={editingQuestionnaire}
                    />
                )}
            </div>
        </>
    );
};

export default AllMyQuestionnairesPage;
