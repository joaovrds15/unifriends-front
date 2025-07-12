import React from 'react';
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
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/logout`, {
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
        <header className="flex justify-between items-center px-5 py-2 bg-white">
            <h1 className="text-2xl font-bold text-gray-800">Affinity</h1>
            <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800 transition"
                onClick={handleLogoutClick}
            >
                Log Out
            </button>
        </header>
    );
}

export default Header;