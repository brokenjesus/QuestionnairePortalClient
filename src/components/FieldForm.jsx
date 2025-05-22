import React, { useState } from 'react';

const FIELD_TYPES = [
    'SINGLE_LINE_TEXT',
    'MULTILINE_TEXT',
    'RADIO_BUTTON',
    'CHECKBOX',
    'COMBOBOX',
    'DATE',
];

const FieldForm = ({ onClose, onSubmit }) => {
    const [label, setLabel] = useState('');
    const [type, setType] = useState('');
    const [required, setRequired] = useState(false);
    const [isActive, setIsActive] = useState(true);
    const [options, setOptions] = useState([]);
    const [error, setError] = useState('');

    const handleAddOption = () => {
        setOptions([...options, '']);
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleRemoveOption = (index) => {
        const newOptions = [...options];
        newOptions.splice(index, 1);
        setOptions(newOptions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dto = {
            label,
            type,
            required,
            active: isActive,
            options: ['RADIO_BUTTON', 'CHECKBOX', 'COMBOBOX'].includes(type)
                ? options.filter(o => o.trim() !== '')
                : []
        };

        try {
            const response = await fetch('http://localhost:8080/api/fields', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dto),
            });

            if (!response.ok) {
                throw new Error('Failed to create field');
            }

            const createdField = await response.json();
            onSubmit(createdField);
        } catch (err) {
            setError(err.message || 'Unknown error occurred');
        }
    };

    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add Field</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {error && <div className="alert alert-danger">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">
                                    Label<span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={label}
                                    onChange={(e) => setLabel(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">
                                    Type<span className="text-danger">*</span>
                                </label>
                                <select
                                    className="form-select"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    required
                                >
                                    <option value="">Select type</option>
                                    {FIELD_TYPES.map((t) => (
                                        <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
                                    ))}
                                </select>
                            </div>

                            {['RADIO_BUTTON', 'CHECKBOX', 'COMBOBOX'].includes(type) && (
                                <div className="mb-3">
                                    <label className="form-label">Options</label>
                                    <div className="border p-2 rounded">
                                        {options.map((opt, idx) => (
                                            <div key={idx} className="d-flex align-items-center mb-2">
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    value={opt}
                                                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-danger ms-2"
                                                    onClick={() => handleRemoveOption(idx)}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button type="button" className="btn btn-sm btn-outline-primary mt-2" onClick={handleAddOption}>
                                        + Add Option
                                    </button>
                                </div>
                            )}

                            {type === 'DATE' && (
                                <div className="mb-3">
                                    <label className="form-label">Date preview</label>
                                    <input type="date" className="form-control" disabled />
                                </div>
                            )}

                            <div className="d-flex gap-4 mb-3">
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="requiredCheck"
                                        checked={required}
                                        onChange={(e) => setRequired(e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor="requiredCheck">
                                        Required
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="activeCheck"
                                        checked={isActive}
                                        onChange={(e) => setIsActive(e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor="activeCheck">
                                        Is Active
                                    </label>
                                </div>
                            </div>

                            <div className="d-flex justify-content-end gap-2">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={onClose}
                                >
                                    CANCEL
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    SAVE
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FieldForm;
