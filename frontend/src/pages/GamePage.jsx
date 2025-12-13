import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { GamePlayer } from '../components/GamePlayer';
import { useAuth } from '../context/AuthContext';

export const GamePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { playerName } = useAuth();
    const level = location.state?.level;

    if (!level) {
        return <Navigate to="/menu" replace />;
    }

    return (
        <GamePlayer 
            initialMaze={level.maze}
            k={level.k}
            mode={level.mode}
            parSteps={level.parSteps}
            levelId={level._id}
            playerName={playerName}
            onExit={() => navigate('/menu')}
        />
    );
};
