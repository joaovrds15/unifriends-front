import React from 'react';
import '../components/components_css/Header.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

function Header() {
    const navigate = useNavigate();
    const { user, logoutUser } = useUser();
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleLogoutClick = async (e) => {
            e.preventDefault();

            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/logout`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                console.log(response);
                if (response.status === 204) {
                    logoutUser();
                    localStorage.removeItem('user');
                    navigate('/');
                } else {
                    console.error('Unexpected logout response:', response.status, await response.text());
                }
            } catch (error) {
                setError('Network error: ' + error.message);
            }
        };

    return (
        <header className="header">
            <h1>Affinity</h1>
            <button className="logout-button" onClick={handleLogoutClick}>Log Out</button>
        </header>
    );

}

export default Header;