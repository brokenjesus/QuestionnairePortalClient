import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('token'); // Удалить токен
        navigate('/login'); // Редирект на страницу входа
    }, [navigate]);

    return null; // Ничего не отображает
};

export default LogoutPage;
