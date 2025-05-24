import React, { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import QuestionnaireService from "../services/QuestionnaireService.jsx";
import Navbar from "../components/Navbar.jsx";

const ResponsesPage = () => {
    const [questionnaires, setQuestionnaires] = useState([]);
    const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [tableFields, setTableFields] = useState([]);
    const [tableTitle, setTableTitle] = useState('');
    const [stompClient, setStompClient] = useState(null);
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuestionnaires = async () => {
            try {
                setLoading(true);
                const data = await QuestionnaireService.getAllQuestionnaires();
                setQuestionnaires(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestionnaires();
    }, []);

    useEffect(() => {
        const client = new Client({
            brokerURL: 'ws://localhost:8080/ws-responses',
            debug: str => console.log('STOMP DEBUG:', str),
            reconnectDelay: 5000,
        });

        client.onConnect = () => {
            setConnected(true);
            console.log('WebSocket connected');

            client.subscribe('/topic/responses', (message) => {
                try {
                    const response = JSON.parse(message.body);
                    setTableFields(response.fields || []);
                    setTableTitle(response.questionnaireTitle || '');
                    setTableData(response.data || []);
                    setError(null);
                } catch (err) {
                    console.error('Error parsing message:', err);
                    setError('Failed to parse server response');
                }
            });

            client.subscribe('/topic/responses', (message) => {
                try {
                    const response = JSON.parse(message.body);
                    console.log("RECEIVED RESPONSE:", response); // 🔍 логирование ответа

                    setTableFields(response.fields || []);
                    setTableTitle(response.questionnaireTitle || '');
                    setTableData(response.data || []);
                    setError(null);
                } catch (err) {
                    console.error('Error parsing message:', err);
                    setError('Failed to parse server response');
                }
            });

        };

        client.onStompError = (frame) => {
            console.error('STOMP error:', frame.headers.message, frame.body);
            setError(`STOMP error: ${frame.headers.message || 'Unknown error'}`);
        };

        client.onWebSocketError = (event) => {
            console.error('WebSocket error:', event);
            setError('WebSocket connection error');
        };

        client.onDisconnect = () => {
            setConnected(false);
            console.log('WebSocket disconnected');
        };

        client.activate();
        setStompClient(client);

        return () => {
            client.deactivate();
        };
    }, []);

    useEffect(() => {
        if (connected && selectedQuestionnaire && stompClient) {
            const token = sessionStorage.getItem('token') || localStorage.getItem('token');

            const payload = {
                questionnaireId: selectedQuestionnaire.id,
            };

            stompClient.publish({
                destination: '/app/responses/get',
                body: JSON.stringify(payload),
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        }
    }, [selectedQuestionnaire, connected, stompClient]);



    if (loading) {
        return <div className="text-center mt-4">Loading questionnaires...</div>;
    }

    if (error) {
        return (
            <div className="alert alert-danger mt-4">
                Error: {error}
                <button
                    className="btn btn-sm btn-secondary ms-2"
                    onClick={() => setError(null)}
                >
                    Dismiss
                </button>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="container mt-4">
                <h2>Responses Table</h2>

                <div className="mb-3">
                    <label htmlFor="questionnaireSelect" className="form-label">
                        Select Questionnaire:
                    </label>
                    <select
                        id="questionnaireSelect"
                        className="form-select"
                        value={selectedQuestionnaire?.id || ''}
                        onChange={(e) => {
                            const qId = e.target.value;
                            const q = questionnaires.find(q => q.id == qId);
                            setSelectedQuestionnaire(q);
                        }}
                        disabled={!connected}
                    >
                        <option value="">-- Select --</option>
                        {questionnaires.map(q => (
                            <option key={q.id} value={q.id}>{q.name + ": " + q.description}</option>
                        ))}
                    </select>
                </div>

                {selectedQuestionnaire && tableFields.length > 0 ? (
                    <div className="mb-5">
                        <h4>{tableTitle}</h4>
                        <div className="table-responsive">
                            <table className="table table-striped table-bordered">
                                <thead>
                                <tr>
                                    {tableFields.map((field, i) => (
                                        <th key={i}>{field}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {tableData.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {tableFields.map((field, colIndex) => (
                                            <td key={colIndex}>{row[field] || 'N/A'}</td>
                                        ))}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : selectedQuestionnaire ? (
                    <div className="alert alert-info mt-3">
                        Loading responses for {selectedQuestionnaire.name}...
                    </div>
                ) : (
                    <div className="alert alert-secondary mt-3">
                        Please select a questionnaire to view responses
                    </div>
                )}

                <div className="mt-3">
                    <small className={`badge ${connected ? 'bg-success' : 'bg-danger'}`}>
                        WebSocket: {connected ? 'Connected' : 'Disconnected'}
                    </small>
                </div>
            </div>
        </>
    );
};

export default ResponsesPage;
