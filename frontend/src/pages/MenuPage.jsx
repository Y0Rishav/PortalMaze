import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const MenuPage = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="flex flex-col gap-4 max-w-sm">
            <h2 className="text-xl font-bold">Main Menu</h2>
            <div className="flex flex-col gap-3">
                <button 
                    className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition-colors text-left" 
                    onClick={() => navigate('/levels')}
                >
                    Play Levels
                </button>
                <button 
                    className="bg-green-500 text-white p-3 rounded hover:bg-green-600 transition-colors text-left" 
                    onClick={() => navigate('/editor')}
                >
                    Map Builder
                </button>
                <button 
                    className="bg-gray-500 text-white p-3 rounded hover:bg-gray-600 transition-colors text-left" 
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};
