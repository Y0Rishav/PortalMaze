import { useNavigate } from 'react-router-dom';
import { GameController } from '../components/GameController.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../api.js';

export const EditorPage = () => {
    const navigate = useNavigate();
    const { playerName } = useAuth();

    const handlePublish = async (levelData) => {
        const { par, ...dataWithoutPar } = levelData;
        try {
            await api.createLevel({ ...dataWithoutPar, creator: playerName });
            alert('Level published successfully!');
            navigate('/menu');
        } catch (error) {
            console.error(error);
            alert('Error publishing level');
        }
    };

    return (
        <GameController 
            playerName={playerName}
            onPublish={handlePublish}
            onExit={() => navigate('/menu')}
        />
    );
};
