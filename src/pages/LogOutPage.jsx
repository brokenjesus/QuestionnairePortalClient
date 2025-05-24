import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        localStorage.removeItem('email');
        sessionStorage.removeItem('firstName');
        localStorage.removeItem('firstName');
        sessionStorage.removeItem('lastName');
        localStorage.removeItem('phoneNumber');
        sessionStorage.removeItem('phoneNumber');
        navigate('/login');
    }, [navigate]);

    return null;
};

export default LogoutPage;
