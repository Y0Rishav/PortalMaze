import React from 'react';

function LevelSelector({ levels, onSelectLevel, onBack }) {
    if (!levels || !Array.isArray(levels)) {
        return (
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-bold">Select a Level</h1>
                    <button className="border p-2 rounded" onClick={onBack}>Back to Menu</button>
                </div>
                <p>Loading levels...</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold">Select a Level</h1>
                <button className="border p-2 rounded" onClick={onBack}>Back to Menu</button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {levels.map((level) => (
                    <div 
                        key={level._id} 
                        className="border p-4 rounded cursor-pointer hover:bg-gray-100" 
                        onClick={() => onSelectLevel(level)}
                    >
                        <h3 className="font-bold">{level.name}</h3>
                        <p className="text-sm text-gray-600">{level.description}</p>
                        <div className="text-xs text-gray-500">Created by: {level.creator}</div>
                        
                        <div className="flex justify-between text-sm mt-2">
                            <span>Max Breaks: {level.k}</span>
                            <span>Par: {level.par} steps</span>
                        </div>
                        
                        <div 
                            className="grid gap-px bg-gray-300 border mt-2" 
                            style={{ gridTemplateColumns: `repeat(${level.maze[0].length}, 1fr)` }}
                        >
                            {level.maze.map((row, rIndex) =>
                                row.map((cell, cIndex) => {
                                    let bgClass = 'bg-white';
                                    if (cell.type === 'wall') bgClass = 'bg-gray-800';
                                    if (cell.type === 'start') bgClass = 'bg-green-500';
                                    if (cell.type === 'goal') bgClass = 'bg-red-500';
                                    if (cell.type === 'portal') {
                                        if (cell.portalColor === 'blue') bgClass = 'bg-blue-500';
                                        if (cell.portalColor === 'red') bgClass = 'bg-red-500';
                                        if (cell.portalColor === 'green') bgClass = 'bg-green-500';
                                        if (cell.portalColor === 'purple') bgClass = 'bg-purple-500';
                                    }
                                    
                                    return <div key={`${rIndex}-${cIndex}`} className={`aspect-square ${bgClass}`}></div>;
                                })
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LevelSelector;
