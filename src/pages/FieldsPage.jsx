import React, { useState, useEffect } from 'react';
import Header from '../components/Header.jsx';
import Pagination from '../components/Pagination';
import FieldForm from '../components/FieldForm.jsx';
import FieldService from '../services/FieldService.jsx';

const FieldsPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [editingField, setEditingField] = useState(null);
    const [fields, setFields] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const pageSize = 10;

    useEffect(() => {
        const fetchFields = async () => {
            try {
                setIsLoading(true);
                const response = await FieldService.getAllFields(currentPage - 1, pageSize);
                const data = response.content ?? response;
                setFields(data);
                setTotalPages(response.totalPages ?? 1);
                setTotalItems(response.totalElements ?? data.length ?? 0);
                setError(null);
            } catch (err) {
                console.error('Ошибка при загрузке полей:', err);
                setError('Failed to load fields');
            } finally {
                setIsLoading(false);
            }
        };

        fetchFields();
    }, [currentPage]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleAddField = async (fieldData) => {
        try {
            const createdField = await FieldService.createField(fieldData);
            setShowModal(false);
            setFields((prev) => [...prev, createdField]);
            setTimeout(() => window.location.reload(), 500);
        } catch (error) {
            console.error('Ошибка при создании поля:', error);
            setError('Failed to create field');
        }
    };

    const handleUpdateField = async (fieldData) => {
        try {
            const updatedField = await FieldService.updateField(editingField.id, fieldData);
            setShowModal(false);
            setEditingField(null);
            setFields((prev) => prev.map((f) => (f.id === updatedField.id ? updatedField : f)));
            setTimeout(() => window.location.reload(), 500);
        } catch (error) {
            console.error('Ошибка при обновлении поля:', error);
            setError('Failed to update field');
        }
    };

    const handleDeleteField = async (id) => {
        if (!window.confirm('Are you sure you want to delete this field?')) return;

        try {
            await FieldService.deleteField(id);
            setFields((prev) => prev.filter((field) => field.id !== id));
            setTotalItems((prev) => prev - 1);
            setTimeout(() => window.location.reload(), 500);
        } catch (error) {
            console.error('Ошибка при удалении поля:', error);
            setError('Failed to delete field');
        }
    };

    const handleEditClick = (field) => {
        setEditingField(field);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingField(null);
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
                    <div className="alert alert-danger d-flex align-items-center justify-content-between">
                        <div>{error}</div>
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
                    <h4>Your Fields</h4>
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            setEditingField(null);
                            setShowModal(true);
                        }}
                    >
                        + ADD FIELD
                    </button>
                </div>

                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead className="table-light">
                        <tr>
                            <th style={{ width: '20%' }}>Label</th>
                            <th style={{ width: '20%' }}>Type</th>
                            <th style={{ width: '20%' }}>Required</th>
                            <th style={{ width: '20%' }}>Is Active</th>
                            <th style={{ width: '10%' }}></th>
                            <th style={{ width: '10%' }}></th>
                        </tr>
                        </thead>
                        <tbody>
                        {fields.length > 0 ? (
                            fields.map((field) => (
                                <tr key={field.id}>
                                    <td>{field.label}</td>
                                    <td>{field.type.replace(/_/g, ' ')}</td>
                                    <td>{field.required ? 'Yes' : 'No'}</td>
                                    <td>{field.active ? 'Yes' : 'No'}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline-secondary"
                                            onClick={() => handleEditClick(field)}
                                        >
                                            ✎ Edit
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDeleteField(field.id)}
                                        >
                                            ❌ Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center text-muted">
                                    No fields found. Create your first field.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {showModal && (
                    <FieldForm
                        onClose={handleCloseModal}
                        onSubmit={editingField ? handleUpdateField : handleAddField}
                        initialData={editingField}
                    />
                )}

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

export default FieldsPage;
