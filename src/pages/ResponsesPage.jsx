import React, { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import QuestionnaireService from "../services/QuestionnaireService.jsx";
import Navbar from "../components/Navbar.jsx";
import Pagination from '../components/Pagination';

const ResponsesPage = () => {
    const [questionnaires, setQuestionnaires] = useState([]);
    const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(null);
    const [tableFields, setTableFields] = useState([]);
    const [tableTitle, setTableTitle] = useState('');
    const [stompClient, setStompClient] = useState(null);
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [content, setContent] = useState([]);

    useEffect(() => {
        const fetchQuestionnaires = async () => {
            try {
                setLoading(true);
                const data = await QuestionnaireService.getAllQuestionnaires();
                setQuestionnaires(data);
            } catch (err) {
                setError(err.message || 'Failed to load questionnaires');
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

                    if (response.content) {
                        if (response.content.length > 0) {
                            const firstRow = response.content[0];
                            setTableFields(Object.keys(firstRow.answers || {}));
                        } else {
                            setTableFields([]);
                        }

                        setContent(response.content);
                        setCurrentPage(response.pageNumber + 1);
                        setPageSize(response.pageSize);
                        setTotalPages(response.totalPages);
                        setTotalElements(response.totalElements);
                        setError(null);
                    } else {
                        setTableFields(response.fields || []);
                        setTableTitle(response.questionnaireTitle || '');
                        setContent(response.data || []);
                    }
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
                page: currentPage - 1,
                size: pageSize
            };

            stompClient.publish({
                destination: '/app/responses/get',
                body: JSON.stringify(payload),
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        }
    }, [selectedQuestionnaire, connected, stompClient, currentPage, pageSize]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container mt-4 text-start">
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
                            const q = questionnaires.find(q => q.id === qId || q.id === Number(qId));
                            setSelectedQuestionnaire(q);
                            setCurrentPage(1);
                        }}
                        disabled={!connected}
                    >
                        <option value="">-- Select --</option>
                        {questionnaires.map(q => (
                            <option key={q.id} value={q.id}>
                                {q.name + ": " + q.description}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedQuestionnaire ? (
                    tableFields.length > 0 ? (
                        <div className="mb-5">
                            <h4>{selectedQuestionnaire.name}</h4>
                            <div className="table-responsive text-center">
                                <table className="table table-striped table-bordered">
                                    <thead>
                                    <tr>
                                        {tableFields.map((field, i) => (
                                            <th key={i}>{field}</th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {content.length === 0 ? (
                                        <tr>
                                            <td colSpan={tableFields.length}>No responses found.</td>
                                        </tr>
                                    ) : (
                                        content.map((row, rowIndex) => (
                                            <tr key={rowIndex}>
                                                {tableFields.map((field, colIndex) => (
                                                    <td key={colIndex}>{row.answers[field] || 'N/A'}</td>
                                                ))}
                                            </tr>
                                        ))
                                    )}
                                    </tbody>
                                </table>
                            </div>

                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalItems={totalElements}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    ) : (
                        <div className="alert alert-info mt-3">
                            {content.length === 0 ?
                                "No responses found for this questionnaire" :
                                "Loading responses for " + selectedQuestionnaire.name + "..."
                            }
                        </div>
                    )
                ) : (
                    <div className="alert alert-secondary mt-3">
                        Please select a questionnaire to view responses
                    </div>
                )}

                {error && (
                    <div className="alert alert-danger mt-3">
                        {error}
                    </div>
                )}
            </div>
        </>
    );
};

export default ResponsesPage;