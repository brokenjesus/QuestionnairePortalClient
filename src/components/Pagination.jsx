import React from 'react';
import PropTypes from 'prop-types';

const Pagination = ({ currentPage, totalPages, totalItems, onPageChange }) => {
    return (
        <nav aria-label="Page navigation">
            <ul className="pagination justify-content-center mt-3">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                        className="page-link"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        ←
                    </button>
                </li>

                {Array.from({ length: totalPages }, (_, index) => (
                    <li
                        key={index}
                        className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                    >
                        <button
                            className="page-link"
                            onClick={() => onPageChange(index + 1)}
                        >
                            {index + 1}
                        </button>
                    </li>
                ))}

                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                        className="page-link"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        →
                    </button>
                </li>
            </ul>
            <div className="text-center">
                <small>
                    Total items: {totalItems} | Page {currentPage} of {totalPages}
                </small>
            </div>
        </nav>
    );
};

Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    totalItems: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
};

export default Pagination;