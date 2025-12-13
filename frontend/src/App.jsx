import { useState, useEffect } from 'react'
import LevelSelector from './components/LevelSelector'
import { GamePlayer } from './components/GamePlayer'
import { GameController } from './components/GameController'
import { ErrorBoundary } from './components/ErrorBoundary'
import { api } from './api'

function App() {
    const [playerName, setPlayerName] = useState('');
    const [mode, setMode] = useState('name'); // 'name', 'menu', 'editor', 'levelSelect', 'play'
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [levels, setLevels] = useState([]);

    useEffect(() => {
        if (mode === 'levelSelect') {
            loadLevels();
        }
    }, [mode]);

    const loadLevels = async () => {
        try {
            const data = await api.getLevels();
            setLevels(data);
        } catch (error) {
            console.error('Error loading levels:', error);
        }
    };

    const handleNameSubmit = (e) => {
        e.preventDefault();
        if (playerName.trim()) {
            setMode('menu');
        }
    };

    const handlePlayLevels = () => {
        setMode('levelSelect');
    };

    const handleMapBuilder = () => {
        setMode('editor');
    };

    const handleSelectLevel = (level) => {
        setSelectedLevel(level);
        setMode('play');
    };

    const handleBackToMenu = () => {
        setMode('menu');
        setSelectedLevel(null);
    };

    const handleExitGame = () => {
        setMode('menu');
        setSelectedLevel(null);
    };

    const handleMapEditorPlay = (maze, k, mode) => {
        setSelectedLevel({ maze, k, mode, _id: null, parSteps: null });
        setMode('play');
    };

    const handlePublishLevel = async (levelData) => {
        try {
            await api.createLevel({ ...levelData, creator: playerName });
            alert('Level published successfully!');
            setMode('menu');
        } catch (error) {
            alert('Error publishing level');
        }
    };

    const handleEditorExit = () => {
        setMode('menu');
    };

    if (mode === 'name') {
        return (
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Portal Maze Game</h1>
                <form onSubmit={handleNameSubmit} className="flex flex-col gap-4 max-w-sm">
                    <label>Enter your name:</label>
                    <input
                        type="text"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        required
                        className="border p-2"
                    />
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded">Start</button>
                </form>
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Portal Maze Game</h1>
                <div className="mb-4">Playing as: {playerName}</div>
                
                {mode === 'menu' && (
                    <div className="flex flex-col gap-4 max-w-sm">
                        <h2 className="text-xl font-bold">Welcome!</h2>
                        <button 
                            className="bg-blue-500 text-white p-2 rounded" 
                            onClick={handlePlayLevels}
                        >
                            Play Levels
                        </button>
                        <button 
                            className="bg-green-500 text-white p-2 rounded" 
                            onClick={handleMapBuilder}
                        >
                            Create Level
                        </button>
                    </div>
                )}
                {mode === 'editor' && (
                    <GameController
                        playerName={playerName}
                        onPublish={handlePublishLevel}
                        onExit={handleBackToMenu}
                    />
                )}
                {mode === 'levelSelect' && (
                    <LevelSelector
                        levels={levels}
                        onSelectLevel={handleSelectLevel}
                        onBack={handleBackToMenu}
                    />
                )}
                {mode === 'play' && selectedLevel && (
                    <GamePlayer
                        initialMaze={selectedLevel.maze}
                        k={selectedLevel.k}
                        mode={selectedLevel.mode}
                        parSteps={selectedLevel.parSteps}
                        levelId={selectedLevel._id}
                        playerName={playerName}
                        onExit={handleExitGame}
                    />
                )}
            </div>
        </ErrorBoundary>
    );
}

export default App
