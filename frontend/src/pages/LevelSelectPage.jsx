import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LevelSelector from '../components/LevelSelector';
import { api } from '../api';

export const LevelSelectPage = () => {
    const [levels, setLevels] = useState([]);
    const navigate = useNavigate();

    const loadLevels = useCallback(async () => {
        try {
            const data = await api.getLevels();
            setLevels(data);
        } catch (error) {
            console.error('Error loading levels:', error);
        }
    }, []);

    useEffect(() => {
        loadLevels();
    }, [loadLevels]);

    return (
        <LevelSelector 
            levels={levels} 
            onSelectLevel={(level, mode) => navigate('/play', { state: { level, mode } })}
            onBack={() => navigate('/menu')}
        />
    );
};
