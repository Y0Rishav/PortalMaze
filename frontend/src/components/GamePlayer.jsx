import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../api';

export const GamePlayer = ({ initialMaze, k, mode, parSteps, levelId, playerName, onExit }) => {
    // Initialize State Lazily or via Derived State
    const initialPlayerState = useMemo(() => {
        let startPos = null;
        initialMaze.forEach(row => row.forEach(cell => {
            if (cell.type === 'start') startPos = { r: cell.r, c: cell.c };
        }));
        return startPos;
    }, [initialMaze]);

    const [maze, setMaze] = useState(() => initialMaze.map(row => row.map(cell => ({ ...cell }))));
    const [player, setPlayer] = useState(initialPlayerState);
    const [wallsBroken, setWallsBroken] = useState(0);
    const [visitedCells, setVisitedCells] = useState(() => {
        return initialPlayerState ? new Set([`${initialPlayerState.r},${initialPlayerState.c}`]) : new Set();
    });
    const [gameStatus, setGameStatus] = useState('playing');
    const [message, setMessage] = useState("");
    const [startTime] = useState(() => Date.now());
    const [elapsed, setElapsed] = useState(0);
    const [leaderboard, setLeaderboard] = useState([]);

    const maxBreaks = mode === 'no-break' ? 0 : k;

    // Load leaderboard
    useEffect(() => {
        if (levelId) {
            loadLeaderboard();
        }
    }, [levelId]);

    const loadLeaderboard = async () => {
        try {
            const response = await api.getLeaderboard(levelId);
            setLeaderboard(response);
        } catch (error) {
            console.error('Error loading leaderboard:', error);
        }
    };

    // Timer
    useEffect(() => {
        if (gameStatus === 'playing') {
            const timer = setInterval(() => {
                setElapsed(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [gameStatus, startTime]);

    // Input Handling
    const handleKeyDown = useCallback((e) => {
        if (gameStatus !== 'playing' || !player) return;

        const { r, c } = player;
        let dr = 0;
        let dc = 0;

        if (e.key === 'ArrowUp' || e.key === 'w') dr = -1;
        else if (e.key === 'ArrowDown' || e.key === 's') dr = 1;
        else if (e.key === 'ArrowLeft' || e.key === 'a') dc = -1;
        else if (e.key === 'ArrowRight' || e.key === 'd') dc = 1;
        else if (e.key === 'Enter') {
            // Handle Portal
            const cell = maze[r][c];
            if (cell.type === 'portal' && cell.portalColor) {
                // Find pair
                let dest = null;
                maze.forEach(row => row.forEach(cx => {
                    if (cx.type === 'portal' && cx.portalColor === cell.portalColor && (cx.r !== r || cx.c !== c)) {
                        dest = cx;
                    }
                }));

                if (dest) {
                    setPlayer({ r: dest.r, c: dest.c });
                    const newVisited = new Set(visitedCells);
                    newVisited.add(`${dest.r},${dest.c}`);
                    setVisitedCells(newVisited);
                    return;
                }
            }
        }

        if (dr === 0 && dc === 0) return;

        const nr = r + dr;
        const nc = c + dc;

        // Bounds Check
        if (nr < 0 || nr >= maze.length || nc < 0 || nc >= maze[0].length) return;

        const nextCell = maze[nr][nc];
        const isWall = nextCell.type === 'wall';
        const isShift = e.shiftKey;

        // Move Logic
        if (isWall) {
            if (isShift && wallsBroken < maxBreaks) {
                // Break Wall
                const newMaze = maze.map(row => row.map(cl => ({ ...cl })));
                newMaze[nr][nc].type = 'empty';
                setMaze(newMaze);
                setWallsBroken(wb => wb + 1);

                // Move into broken wall
                setPlayer({ r: nr, c: nc });
                const newVisited = new Set(visitedCells);
                newVisited.add(`${nr},${nc}`);
                setVisitedCells(newVisited);
            } else {
                setMessage(isShift ? "No more wall breaks!" : "Blocked! Hold Shift to break.");
                setTimeout(() => setMessage(""), 1000);
            }
        } else {
            // Normal Move
            setPlayer({ r: nr, c: nc });
            const newVisited = new Set(visitedCells);
            newVisited.add(`${nr},${nc}`);
            setVisitedCells(newVisited);

            if (nextCell.type === 'goal') {
                setGameStatus('won');
                // Submit score
                if (levelId && playerName) {
                    const steps = visitedCells.size - 1; // Exclude start
                    const efficiency = parSteps ? steps / parSteps : steps;
                    api.submitScore({
                        levelId,
                        playerName,
                        steps,
                        time: elapsed,
                        efficiency
                    }).then(() => {
                        loadLeaderboard(); // Refresh leaderboard
                    }).catch(err => console.error('Error submitting score:', err));
                }
            }
        }

    }, [gameStatus, player, maze, wallsBroken, maxBreaks, visitedCells, elapsed, levelId, playerName, parSteps]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    if (!player) return <div className="p-4 bg-red-100 text-red-800">Error: No Start Point</div>;

    return (
        <div className="flex flex-col items-center p-4">
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex flex-col gap-4 order-2 lg:order-1">
                    <button 
                        className="border p-2 rounded" 
                        onClick={onExit}
                    >
                        Exit to Menu
                    </button>
                    
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between">
                            <span>Time:</span>
                            <strong>{elapsed}s</strong>
                        </div>
                        <div className="flex justify-between">
                            <span>Mode:</span>
                            <strong>{mode}</strong>
                        </div>
                        <div className="flex justify-between">
                            <span>Steps:</span>
                            <div>
                                <strong>{visitedCells.size - 1}</strong>
                                <span className="text-xs text-gray-500 ml-1">(Par: {parSteps})</span>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <span>Breaks:</span>
                            <strong>{wallsBroken} / {maxBreaks}</strong>
                        </div>
                    </div>

                    {leaderboard.length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                            <h4 className="font-bold mb-2">Leaderboard</h4>
                            <ol className="list-decimal pl-5 text-sm">
                                {leaderboard.map((score, index) => (
                                    <li key={index}>
                                        <span className="font-medium">{score.playerName}</span>: {score.steps} steps, {score.time}s
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )}
                    
                    <div className="mt-4 text-sm text-gray-600">
                        <p>WASD/Arrows to Move</p>
                        <p>Shift + Move to Break Wall</p>
                        <p>Enter on Portal to Teleport</p>
                    </div>
                </div>

                {message && (
                    <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded">
                        {message}
                    </div>
                )}
                
                

                <div 
                    className="grid gap-px bg-gray-300 border order-1 lg:order-2" 
                    style={{ gridTemplateColumns: `repeat(${maze[0].length}, 1fr)` }}
                >
                    {maze.map((row, rIndex) => (
                        row.map((cell, cIndex) => {
                            const isPlayer = player && player.r === cell.r && player.c === cell.c;
                            let content = '';
                            let bgClass = 'bg-white';
                            let textClass = 'text-gray-400';

                            if (cell.type === 'wall') bgClass = 'bg-gray-800';
                            if (cell.type === 'start') { content = 'S'; bgClass = 'bg-green-500'; textClass = 'text-white font-bold'; }
                            if (cell.type === 'goal') { content = 'G'; bgClass = 'bg-red-500'; textClass = 'text-white font-bold'; }
                            
                            if (visitedCells.has(`${cell.r},${cell.c}`)) {
                                if (cell.type !== 'start' && cell.type !== 'goal' && cell.type !== 'portal') {
                                    bgClass = 'bg-blue-100';
                                }
                            }

                            return (
                                <div
                                    key={`${rIndex}-${cIndex}`}
                                    className={`w-10 h-10 flex items-center justify-center relative ${bgClass} ${textClass}`}
                                    style={cell.type === 'portal' ? { backgroundColor: cell.portalColor } : {}}
                                >
                                    {content}
                                    {isPlayer && (
                                        <div className="absolute w-3/5 h-3/5 bg-black rounded-full" />
                                    )}
                                </div>
                            );
                        })
                    ))}
                </div>
            </div>
        </div>
    );
};
