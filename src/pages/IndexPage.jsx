import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import React from "react";


const HomePage = () => {
    const email = sessionStorage.getItem('email') || localStorage.getItem('email') ;
    return (
        <>
            <Navbar />
            <div className="container mt-4">
                <h1>Welcome to the Home Page</h1>
                {email && <p>Your email: <strong>{email}</strong></p>}
                <Link to="/logout" className="btn btn-outline-danger">Log Out</Link>
            </div>
        </>
    );
};

export default HomePage;
