import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import React from "react";

const HomePage = () => {
    const email = sessionStorage.getItem('email') || localStorage.getItem('email');

    return (
        <>
            <Header />
            <div className="container mt-4">
                <h1>Welcome to the Home Page</h1>
                {email && <p>Your email: <strong>{email}</strong></p>}

                <Link to="/questionnaires" className="btn btn-primary mb-3">
                    {email ? 'Go to Questionnaires' : 'View Questionnaires'}
                </Link>

                {!email && <p className="mt-2"><em>Log in to create your own questionnaires</em></p>}
            </div>
        </>
    );
};

export default HomePage;