import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import QuestionnaireService from '../services/QuestionnaireService.jsx';
import QuestionnaireForm from '../components/QuestionnaireForm.jsx';

const AllQuestionnairesPage = () => {
    const [questionnaires, setQuestionnaires] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingQuestionnaire, setEditingQuestionnaire] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 10;

    useEffect(() => {
        const fetchQuestionnaires = async () => {
            try {
                setIsLoading(true);
                const data = await QuestionnaireService.getAllQuestionnairesPageable(currentPage, pageSize);
                setQuestionnaires(data);
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

    const handleCreateQuestionnaire = async (questionnaireData) => {
        try {
            const created = await QuestionnaireService.createQuestionnaire(questionnaireData);
            setQuestionnaires(prev => [...prev, created]);
            setShowModal(false);
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
        } catch (error) {
            console.error("Error updating questionnaire:", error);
            setError('Failed to update questionnaire');
        }
    };

    const handleDeleteQuestionnaire = async (id) => {
        if (!window.confirm('Are you sure you want to delete this questionnaire?')) return;

        try {
            await QuestionnaireService.deleteQuestionnaire(id);
            setQuestionnaires(prev => prev.filter(q => q.id !== id));
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
                <Navbar />
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
                <Navbar />
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
            <Navbar />
            <div className="container mt-4">
                <div className="d-flex justify-content-between mb-3">
                    <h2>Questionnaires</h2>
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
                            <th>Id</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Fields Count</th>
                            <th>Actions</th>
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
                                        <div className="d-flex gap-2">
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
                                <td colSpan="4" className="text-center text-muted">
                                    No questionnaires found. Create your first questionnaire.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                <nav aria-label="Page navigation">
                    <ul className="pagination justify-content-center mt-3">
                        <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}>
                                ←
                            </button>
                        </li>

                        <li className="page-item active">
                            <span className="page-link">
                                {currentPage + 1}
                            </span>
                        </li>

                        <li className={`page-item ${questionnaires.length < pageSize ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setCurrentPage(prev => prev + 1)}>
                                →
                            </button>
                        </li>
                    </ul>
                </nav>

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

export default AllQuestionnairesPage;