import React from 'react';
import { Dropdown } from 'react-bootstrap';

const handleLogout = () => {
    ['token', 'email', 'firstName', 'lastName', 'phoneNumber'].forEach(localStorage.removeItem.bind(localStorage));
    window.location.href = '/login';
};

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom px-4 fixed-top">
            <a className="navbar-brand fw-bold" href="/">
                <span className="text-dark">LOGO</span><span className="text-primary">TYPE</span>
            </a>
            <div className="collapse navbar-collapse">
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <a className="nav-link" href="/fields">Fields</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/questionnaires">Questionnaire</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/responses">Responses</a>
                    </li>
                </ul>

                <Dropdown>
                    <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                        {sessionStorage.getItem('firstName') || localStorage.getItem('firstName')}
                    </Dropdown.Toggle>

                    <Dropdown.Menu align="end">
                        <Dropdown.Item href="/profile">Edit Profile</Dropdown.Item>
                        <Dropdown.Item href="/change-password">Change Password</Dropdown.Item>
                        <Dropdown.Item as="button" className="text-danger" onClick={handleLogout}>
                            Log Out
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </nav>
    );
};

export default Navbar;