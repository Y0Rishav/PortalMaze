import{ useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LevelSelector from '../components/LevelSelector';
import { api } from '../api';

export const LevelSelectPage = () => {
    const [levels, setLevels] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadLevels();
    }, []);

    const loadLevels = async () => {
        try {
            const data = await api.getLevels();
            setLevels(data);
        } catch (error) {
            console.error('Error loading levels:', error);
        }
    };

    return (
        <LevelSelector 
            levels={levels} 
            onSelectLevel={(level) => navigate('/play', { state: { level } })}
            onBack={() => navigate('/menu')}
        />
    );
};
