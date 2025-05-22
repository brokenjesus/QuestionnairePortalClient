import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import FieldForm from '../components/FieldForm.jsx';

const FieldsPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [fields, setFields] = useState([]);

    // Загрузка данных при монтировании компонента
    useEffect(() => {
        fetch('/api/fields')
            .then(response => response.json())
            .then(data => setFields(data))
            .catch(error => console.error("Ошибка при загрузке полей:", error));
    }, []);

    const handleAddField = (newField) => {
        // Отправка POST-запроса
        fetch('/api/fields', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newField)
        })
            .then(response => response.json())
            .then(createdField => {
                setFields(prevFields => [...prevFields, createdField]);
                setShowModal(false);
            })
            .catch(error => {
                console.error("Ошибка при создании поля:", error);
            });
    };

    return (
        <>
            <Navbar />
            <div className="container mt-4">
                <div className="d-flex justify-content-between mb-3">
                    <h4>Fields</h4>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
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
                        {fields.map((field, index) => (
                            <tr key={field.id || index}>
                                <td>{field.label}</td>
                                <td>{field.type}</td>
                                <td>{field.required ? "True" : "False"}</td>
                                <td>{field.active ? "True" : "False"}</td>
                                <td>
                                    <button className="btn btn-sm btn-outline-secondary">✎</button>
                                </td>
                                <td>
                                    <button className="btn btn-sm btn-outline-secondary">⚙</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {showModal && (
                    <FieldForm
                        onClose={() => setShowModal(false)}
                        onSubmit={handleAddField}
                    />
                )}
            </div>
        </>
    );
};

export default FieldsPage;
