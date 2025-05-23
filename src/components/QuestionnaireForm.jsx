import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FieldService from '../services/FieldService.jsx';

const QuestionnaireForm = ({ onClose, onSubmit, initialData }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [fields, setFields] = useState([]);
    const [selectedFields, setSelectedFields] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchActiveFields = async () => {
            try {
                const token = localStorage.getItem('token');
                const data = await FieldService.getActiveFields(token);
                setFields(data);
                setIsLoading(false);
            } catch (err) {
                console.error("Error loading active fields:", err);
                setError('Failed to load active fields');
                setIsLoading(false);
            }
        };

        fetchActiveFields();
    }, []);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setDescription(initialData.description);
            setSelectedFields(initialData.fields?.map(f => f.id) || []);
        } else {
            setName('');
            setDescription('');
            setSelectedFields([]);
        }
    }, [initialData]);

    const handleFieldToggle = (fieldId) => {
        setSelectedFields(prev =>
            prev.includes(fieldId)
                ? prev.filter(id => id !== fieldId)
                : [...prev, fieldId]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) {
            setError('Name is required');
            return;
        }

        const questionnaireData = {
            name,
            description,
            fields: selectedFields.map(id => ({ id }))
        };

        onSubmit(questionnaireData);
    };

    if (isLoading) {
        return (
            <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-body text-center py-4">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            {initialData ? 'Edit Questionnaire' : 'Create Questionnaire'}
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        {error && (
                            <div className="alert alert-danger mb-3">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">
                                    Name<span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    placeholder="Enter questionnaire name"
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">
                                    Description
                                </label>
                                <textarea
                                    className="form-control"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter questionnaire description"
                                    rows={3}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">
                                    Fields
                                </label>
                                <div className="border p-3 rounded" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    {fields.length > 0 ? (
                                        fields.map(field => (
                                            <div key={field.id} className="form-check mb-2">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={`field-${field.id}`}
                                                    checked={selectedFields.includes(field.id)}
                                                    onChange={() => handleFieldToggle(field.id)}
                                                />
                                                <label className="form-check-label" htmlFor={`field-${field.id}`}>
                                                    {field.label} ({field.type.replace(/_/g, ' ')})
                                                    {field.required && <span className="text-danger ms-1">*</span>}
                                                </label>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-muted">
                                            No active fields available. Please create fields first.
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="d-flex justify-content-end gap-2">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={onClose}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={fields.length === 0}
                                >
                                    {initialData ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

QuestionnaireForm.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    initialData: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        description: PropTypes.string,
        fields: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            label: PropTypes.string,
            type: PropTypes.string
        }))
    })
};

QuestionnaireForm.defaultProps = {
    initialData: null
};

export default QuestionnaireForm;