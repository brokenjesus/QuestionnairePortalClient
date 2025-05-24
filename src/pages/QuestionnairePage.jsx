import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import QuestionnaireService from '../services/QuestionnaireService';
import ResponseService from '../services/ResponseService';

const QuestionnairePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [questionnaire, setQuestionnaire] = useState(null);
    const [answers, setAnswers] = useState({});
    const [initialAnswers, setInitialAnswers] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    useEffect(() => {
        const fetchQuestionnaire = async () => {
            try {
                const data = await QuestionnaireService.getQuestionnaireById(id);
                setQuestionnaire(data);

                const defaults = {};
                data.fields.forEach(field => {
                    defaults[field.id] = field.type === 'CHECKBOX' ? [] : '';
                });

                setAnswers(defaults);
                setInitialAnswers(defaults);
                setError(null);
            } catch (err) {
                console.error("Error loading questionnaire:", err);
                setError('Failed to load questionnaire');
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuestionnaire();
    }, [id]);

    const handleInputChange = (fieldId, value) => {
        setAnswers(prev => ({
            ...prev,
            [fieldId]: value
        }));
    };

    const handleCheckboxChange = (fieldId, optionValue, isChecked) => {
        setAnswers(prev => {
            const currentValues = prev[fieldId] || [];
            return {
                ...prev,
                [fieldId]: isChecked
                    ? [...currentValues, optionValue]
                    : currentValues.filter(v => v !== optionValue)
            };
        });
    };

    const handleClearForm = () => {
        setAnswers(initialAnswers);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const missingFields = questionnaire.fields
                .filter(field => field.isRequired)
                .filter(field => {
                    const answer = answers[field.id];
                    return field.type === 'CHECKBOX' ? answer?.length === 0 : !answer;
                });

            if (missingFields.length > 0) {
                setError(`Please fill in all required fields: ${missingFields.map(f => f.label).join(', ')}`);
                return;
            }

            const responseData = {
                questionnaireId: questionnaire.id,
                answers: Object.entries(answers).map(([fieldId, answer]) => ({
                    fieldId: parseInt(fieldId),
                    answer: Array.isArray(answer) ? answer.join(',') : answer.toString()
                }))
            };

            await ResponseService.submitResponse(responseData);
            setSubmitSuccess(true);

            setTimeout(() => {
                navigate('/questionnaires');
            }, 3000);
        } catch (err) {
            console.error("Error submitting response:", err);
            setError('Failed to submit response. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderFieldInput = (field) => {
        switch (field.type) {
            case 'SINGLE_LINE_TEXT':
                return (
                    <input
                        type="text"
                        className="form-control"
                        value={answers[field.id] || ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        required={field.isRequired}
                    />
                );
            case 'MULTILINE_TEXT':
                return (
                    <textarea
                        className="form-control"
                        value={answers[field.id] || ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        rows={4}
                        required={field.isRequired}
                    />
                );
            case 'RADIO_BUTTON':
                return (
                    <div className="btn-group-vertical" role="group">
                        {field.options.map((option, idx) => (
                            <div key={idx} className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name={`radio-${field.id}`}
                                    id={`radio-${field.id}-${idx}`}
                                    value={option}
                                    checked={answers[field.id] === option}
                                    onChange={() => handleInputChange(field.id, option)}
                                    required={field.isRequired}
                                />
                                <label className="form-check-label" htmlFor={`radio-${field.id}-${idx}`}>
                                    {option}
                                </label>
                            </div>
                        ))}
                    </div>
                );
            case 'CHECKBOX':
                return (
                    <div className="btn-group-vertical" role="group">
                        {field.options.map((option, idx) => (
                            <div key={idx} className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={`checkbox-${field.id}-${idx}`}
                                    value={option}
                                    checked={answers[field.id]?.includes(option) || false}
                                    onChange={(e) => handleCheckboxChange(field.id, option, e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor={`checkbox-${field.id}-${idx}`}>
                                    {option}
                                </label>
                            </div>
                        ))}
                    </div>
                );
            case 'COMBOBOX':
                return (
                    <select
                        className="form-select"
                        value={answers[field.id] || ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        required={field.isRequired}
                    >
                        <option value="">Select an option</option>
                        {field.options.map((option, idx) => (
                            <option key={idx} value={option}>{option}</option>
                        ))}
                    </select>
                );
            case 'DATE':
                return (
                    <input
                        type="date"
                        className="form-control"
                        value={answers[field.id] || ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        required={field.isRequired}
                    />
                );
            default:
                return <p>Unsupported field type</p>;
        }
    };

    if (isLoading) {
        return (
            <>
                <Navbar />
                <div className="container mt-4 text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
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

    if (submitSuccess) {
        return (
            <>
                <Navbar />
                <div className="container mt-4">
                    <div className="alert alert-success">
                        <h4 className="alert-heading">Thank you!</h4>
                        <p>Your response has been submitted successfully.</p>
                        <p>You will be redirected shortly...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="container mt-4 w-25">
                <div className="card">
                    <div className="card-header bg-primary text-white">
                        <h2>{questionnaire.name}</h2>
                        <p className="mb-0">{questionnaire.description}</p>
                    </div>

                    <div className="card-body">
                        {error && (
                            <div className="alert alert-danger mb-4">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            {questionnaire.fields.map((field) => (
                                <div key={field.id} className="mb-4 text-start d-flex flex-column">
                                    <label className="form-label">
                                        {field.label}
                                        {field.required && <span className="text-danger ms-1">*</span>}
                                    </label>
                                    {renderFieldInput(field)}
                                </div>
                            ))}

                            <div className="d-flex justify-content-between mt-4">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={handleClearForm}
                                >
                                    Clear⌫
                                </button>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Submitting...
                                        </>
                                    ) : (
                                        'Submit'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default QuestionnairePage;