import React, { useState } from 'react';
import { createEmptyMaze, validateMap } from '../utils/mazeLogic';

const ROWS = 10;
const COLS = 10;
const PORTAL_COLORS = ['blue', 'red', 'green', 'purple'];

export const MapEditor = ({ onPlay, onPublish, onExit }) => {
    const [maze, setMaze] = useState(createEmptyMaze(ROWS, COLS));
    const [k, setK] = useState(1);
    const [selectedTool, setSelectedTool] = useState('wall');
    const [selectedPortalColor, setSelectedPortalColor] = useState('blue');
    const [validationResult, setValidationResult] = useState(null);
    const [levelName, setLevelName] = useState('');
    const [levelDescription, setLevelDescription] = useState('');

    const handleCellClick = (r, c) => {
        const newMaze = maze.map(row => row.map(cell => ({ ...cell })));
        let cell = newMaze[r][c];

        // Ensure only one Start/Goal
        if (selectedTool === 'start') {
            newMaze.forEach(row => row.forEach(cx => { if (cx.type === 'start') cx.type = 'empty'; }));
        }
        if (selectedTool === 'goal') {
            newMaze.forEach(row => row.forEach(cx => { if (cx.type === 'goal') cx.type = 'empty'; }));
        }

        // Apply tool
        if (selectedTool === 'portal') {
            cell.type = 'portal';
            cell.portalColor = selectedPortalColor;
        } else {
            cell.type = selectedTool;
            delete cell.portalColor;
        }

        newMaze[r][c] = cell;
        setMaze(newMaze);
        setValidationResult(null);
    };

    const runValidation = () => {
        const result = validateMap(maze, k);
        setValidationResult(result);
    };

    const handlePublish = () => {
        if (onPublish && levelName.trim() && levelDescription.trim()) {
            onPublish({
                name: levelName,
                description: levelDescription,
                maze,
                k,
                par: validationResult.kBreakSolution?.pathLength || 0
            });
        }
    };

    return (
        <div className="flex flex-col items-center p-4">
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-bold">Map Editor</h2>
                    
                    <div className="flex flex-col gap-2">
                        <label className="font-bold">Tool:</label>
                        <div className="grid grid-cols-2 gap-2">
                            <button 
                                className={`p-2 border rounded ${selectedTool === 'wall' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} 
                                onClick={() => setSelectedTool('wall')}
                            >
                                Wall
                            </button>
                            <button 
                                className={`p-2 border rounded ${selectedTool === 'empty' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} 
                                onClick={() => setSelectedTool('empty')}
                            >
                                Eraser
                            </button>
                            <button 
                                className={`p-2 border rounded ${selectedTool === 'start' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} 
                                onClick={() => setSelectedTool('start')}
                            >
                                Start
                            </button>
                            <button 
                                className={`p-2 border rounded ${selectedTool === 'goal' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} 
                                onClick={() => setSelectedTool('goal')}
                            >
                                Goal
                            </button>
                        </div>

                        <label className="font-bold mt-4">Portals:</label>
                        <div className="flex gap-2">
                            {PORTAL_COLORS.map(color => (
                                <button
                                    key={color}
                                    className={`w-8 h-8 rounded-full border-2 ${selectedTool === 'portal' && selectedPortalColor === color ? 'border-black' : 'border-transparent'}`}
                                    onClick={() => { setSelectedTool('portal'); setSelectedPortalColor(color); }}
                                    style={{ backgroundColor: color }}
                                    title={`Portal: ${color}`}
                                />
                            ))}
                        </div>

                        <label className="font-bold mt-4">Max Wall Breaks (K):</label>
                        <input
                            type="number"
                            value={k}
                            onChange={(e) => setK(Math.max(0, Number(e.target.value)))}
                            min="0"
                            max="10"
                            className="border p-2 rounded"
                        />

                        <button 
                            className="bg-purple-500 text-white p-2 rounded mt-4" 
                            onClick={runValidation}
                        >
                            Validate Map
                        </button>

                        {validationResult?.valid && (
                            <div className="flex flex-col gap-2 mt-4 p-4 border rounded">
                                <label className="text-xs font-bold">Level Name:</label>
                                <input
                                    type="text"
                                    value={levelName}
                                    onChange={(e) => setLevelName(e.target.value)}
                                    placeholder="Enter level name"
                                    className="border p-2 rounded text-sm"
                                />
                                <label className="text-xs font-bold">Description:</label>
                                <textarea
                                    value={levelDescription}
                                    onChange={(e) => setLevelDescription(e.target.value)}
                                    placeholder="Enter level description"
                                    rows="3"
                                    className="border p-2 rounded text-sm"
                                />
                            </div>
                        )}

                        {onPlay && validationResult?.valid && (
                            <div className="flex flex-col gap-2 mt-4">
                                <h3 className="font-bold text-sm">Test Play</h3>
                                <button 
                                    className="bg-blue-500 text-white p-2 rounded text-sm" 
                                    onClick={() => onPlay(maze, k, 'no-break')}
                                >
                                    Play (No Breaks)
                                </button>
                                <button 
                                    className="bg-blue-500 text-white p-2 rounded text-sm" 
                                    onClick={() => onPlay(maze, k, 'wall-break')}
                                >
                                    Play (Max {k} Breaks)
                                </button>
                            </div>
                        )}

                        {onPublish && validationResult?.valid && levelName.trim() && levelDescription.trim() && (
                            <button 
                                className="bg-green-500 text-white p-2 rounded mt-4" 
                                onClick={handlePublish}
                            >
                                Publish Level
                            </button>
                        )}
                    </div>

                    {validationResult && (
                        <div className={`p-3 rounded text-sm ${validationResult.valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {validationResult.valid ? (
                                <>
                                    <h3 className="font-bold mb-1">✓ Map Valid!</h3>
                                    <p>
                                        <strong>0-Break Path:</strong>{' '}
                                        {validationResult.zeroBreakSolution?.reachable 
                                            ? `${validationResult.zeroBreakSolution.pathLength} steps` 
                                            : 'Unreachable'}
                                    </p>
                                    <p>
                                        <strong>{k}-Break Path:</strong>{' '}
                                        {validationResult.kBreakSolution?.reachable 
                                            ? `${validationResult.kBreakSolution.pathLength} steps` 
                                            : 'Unreachable'}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <h3 className="font-bold mb-1">✗ Invalid Map</h3>
                                    <ul className="list-disc pl-4">
                                        {validationResult.errors.map((e, i) => (
                                            <li key={i}>{e}</li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <div 
                    className="grid gap-px bg-gray-300 border" 
                    style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
                >
                    {maze.map((row, rIndex) => (
                        row.map((cell, cIndex) => {
                            let content = '';
                            let bgClass = 'bg-white';
                            let textClass = 'text-gray-400';

                            if (cell.type === 'wall') bgClass = 'bg-gray-800';
                            if (cell.type === 'start') { content = 'S'; bgClass = 'bg-green-500'; textClass = 'text-white font-bold'; }
                            if (cell.type === 'goal') { content = 'G'; bgClass = 'bg-red-500'; textClass = 'text-white font-bold'; }
                            
                            // Highlight solution paths
                            const isPath0 = validationResult?.valid && 
                                validationResult.zeroBreakSolution?.path?.some((p) => p.r === rIndex && p.c === cIndex);
                            const isPathK = validationResult?.valid && 
                                validationResult.kBreakSolution?.path?.some((p) => p.r === rIndex && p.c === cIndex);

                            let ringClass = '';
                            if (isPathK) ringClass = 'ring-2 ring-inset ring-blue-500';
                            if (isPath0) ringClass = 'ring-2 ring-inset ring-green-500';

                            return (
                                <div
                                    key={`${rIndex}-${cIndex}`}
                                    className={`w-10 h-10 flex items-center justify-center cursor-pointer border border-gray-100 ${bgClass} ${textClass} ${ringClass}`}
                                    onClick={() => handleCellClick(rIndex, cIndex)}
                                    style={cell.type === 'portal' ? { backgroundColor: cell.portalColor } : {}}
                                    title={`(${rIndex}, ${cIndex}) - Click to edit`}
                                >
                                    {content}
                                </div>
                            );
                        })
                    ))}
                </div>
            </div>
        </div>
    );
};                               