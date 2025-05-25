import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Pagination from '../components/Pagination.jsx';
import QuestionnaireService from '../services/QuestionnaireService.jsx';

const AllQuestionnairesPage = () => {
    const [questionnaires, setQuestionnaires] = useState([]);
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
                const response = await QuestionnaireService.getAllQuestionnairesPageable(currentPage - 1, pageSize);
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
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2>All Questionnaires</h2>
                    <Link to="/questionnaires/my" className="btn btn-secondary">
                        My Questionnaires
                    </Link>
                </div>

                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead className="table-light">
                        <tr>
                            <th style={{ width: '10%' }}>Id</th>
                            <th style={{ width: '25%' }}>Name</th>
                            <th style={{ width: '45%' }}>Description</th>
                            <th style={{ width: '20%' }}>Fields Count</th>
                        </tr>
                        </thead>
                        <tbody>
                        {questionnaires.length > 0 ? (
                            questionnaires.map((q) => (
                                <tr
                                    key={q.id}
                                    onClick={() => window.location.href = `/questionnaires/${q.id}`}
                                    style={{cursor: 'pointer'}}
                                    className="clickable-row"
                                >
                                    <td>{q.id}</td>
                                    <td>{q.name}</td>
                                    <td>{q.description}</td>
                                    <td>{q.fields?.length || 0}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center text-muted">
                                    No questionnaires found.
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
            </div>
        </>
    );
};

export default AllQuestionnairesPage;
