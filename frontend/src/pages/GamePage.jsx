import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { GamePlayer } from '../components/GamePlayer';
import { useAuth } from '../context/AuthContext';

export const GamePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { playerName } = useAuth();
    const { level, mode } = location.state || {};

    if (!level || !mode) {
        return <Navigate to="/levels" replace />;
    }

    if (mode === 'nwb' && level.parNWB === 0) {
        return <Navigate to="/levels" replace />;
    }

    const modeName = mode === 'nwb' ? 'No-Wall-Break' : 'Wall-Break';
    const k = mode === 'nwb' ? 0 : level.k;
    const parSteps = mode === 'nwb' ? level.parNWB : level.parWB;

    return (
        <GamePlayer 
            initialMaze={level.maze}
            k={k}
            mode={mode}
            parSteps={parSteps}
            levelId={level._id}
            playerName={playerName}
            levelName={`${level.name} (${modeName})`}
            onExit={() => navigate('/menu')}
        />
    );
};
