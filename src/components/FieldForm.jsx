import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const FIELD_TYPES = [
    'SINGLE_LINE_TEXT',
    'MULTILINE_TEXT',
    'RADIO_BUTTON',
    'CHECKBOX',
    'COMBOBOX',
    'DATE',
];

const FieldForm = ({ onClose, onSubmit, initialData }) => {
    const [label, setLabel] = useState('');
    const [type, setType] = useState('');
    const [isRequired, setRequired] = useState(false);
    const [isActive, setIsActive] = useState(true);
    const [options, setOptions] = useState([]);
    const [error, setError] = useState('');

    // Инициализация формы данными для редактирования
    useEffect(() => {
        if (initialData) {
            setLabel(initialData.label);
            setType(initialData.type);
            setRequired(initialData.required);
            setIsActive(initialData.active);
            setOptions(initialData.options || []);
        } else {
            // Сброс формы для создания нового поля
            setLabel('');
            setType('');
            setRequired(false);
            setIsActive(true);
            setOptions([]);
        }
    }, [initialData]);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Валидация
        if (!label.trim()) {
            setError('Label is required');
            return;
        }

        if (!type) {
            setError('Type is required');
            return;
        }

        const fieldTypesWithOptions = ['RADIO_BUTTON', 'CHECKBOX', 'COMBOBOX'];
        if (fieldTypesWithOptions.includes(type) && options.filter(o => o.trim() !== '').length === 0) {
            setError('At least one option is required for this field type');
            return;
        }

        const dto = {
            label,
            type,
            required: isRequired,
            active: isActive,
            options: fieldTypesWithOptions.includes(type)
                ? options.filter(o => o.trim() !== '')
                : []
        };

        onSubmit(dto);
    };

    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{initialData ? 'Edit Field' : 'Add Field'}</h5>
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
                                    Label<span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={label}
                                    onChange={(e) => setLabel(e.target.value)}
                                    required
                                    placeholder="Enter field label"
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
                                    disabled={!!initialData} // Запрещаем менять тип при редактировании
                                >
                                    <option value="">Select field type</option>
                                    {FIELD_TYPES.map((t) => (
                                        <option key={t} value={t}>
                                            {t.replace(/_/g, ' ')}
                                        </option>
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
                                                    placeholder={`Option ${idx + 1}`}
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-danger ms-2"
                                                    onClick={() => handleRemoveOption(idx)}
                                                    aria-label="Remove option"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                        {options.length === 0 && (
                                            <div className="text-muted small">
                                                No options added yet
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-primary mt-2"
                                        onClick={handleAddOption}
                                    >
                                        + Add Option
                                    </button>
                                </div>
                            )}

                            {type === 'DATE' && (
                                <div className="mb-3">
                                    <label className="form-label">Date preview</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        disabled
                                    />
                                </div>
                            )}

                            <div className="d-flex gap-4 mb-3">
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="requiredCheck"
                                        checked={isRequired}
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
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    {initialData ? 'UPDATE' : 'SAVE'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

FieldForm.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    initialData: PropTypes.shape({
        id: PropTypes.number,
        label: PropTypes.string,
        type: PropTypes.string,
        required: PropTypes.bool,
        active: PropTypes.bool,
        options: PropTypes.arrayOf(PropTypes.string),
    }),
};

FieldForm.defaultProps = {
    initialData: null,
};

export default FieldForm;