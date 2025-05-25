import React from 'react';
import { Dropdown } from 'react-bootstrap';

const Header = () => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    const firstName = sessionStorage.getItem('firstName') || localStorage.getItem('firstName');

    if (!token) {
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom px-4 fixed-top">
                <a className="navbar-brand fw-bold" href="/">
                    <span className="text-dark">LOGO</span><span className="text-primary">TYPE</span>
                </a>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link" href="/questionnaires">Questionnaire</a>
                        </li>

                        <li className="nav-item">
                            <a className="nav-link" href="/login">Log In</a>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }

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
                        {firstName}
                    </Dropdown.Toggle>

                    <Dropdown.Menu align="end">
                        <Dropdown.Item href="/profile">Edit Profile</Dropdown.Item>
                        <Dropdown.Item href="/change-password">Change Password</Dropdown.Item>
                        <Dropdown.Item className="text-danger" href="/logout">
                            Log Out
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </nav>
    );
};

export default Header;
