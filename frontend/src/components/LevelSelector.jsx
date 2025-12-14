import React from 'react';

function LevelSelector({ levels, onSelectLevel, onBack }) {
    if (!levels || !Array.isArray(levels)) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Select a Level</h1>
                    <button
                        onClick={onBack}
                        className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        Back to Menu
                    </button>
                </div>
                <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
                    <p>Loading levels...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Select a Level</h1>
                    <p className="text-slate-500 mt-1">Choose a maze to challenge your skills</p>
                </div>

                <button
                    onClick={onBack}
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                >
                    Back to Menu
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {levels.map((level) => {
                    const rows = level.maze ? level.maze.length : 0;
                    const cols = level.maze && level.maze[0] ? level.maze[0].length : 0;

                    return (
                        <div
                            key={level._id}
                            className="group bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 flex flex-col h-full"
                            onClick={() => onSelectLevel(level)}
                        >
                            <div className="mb-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-xl text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{level.name}</h3>
                                </div>
                                <p className="text-sm text-slate-500 line-clamp-2 min-h-[2.5em]">{level.description || "No description provided."}</p>
                            </div>

                            <div className="mt-auto space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                        <div className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Size</div>
                                        <div className="text-slate-900 font-medium">{rows} x {cols}</div>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                        <div className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Shortest Path</div>
                                        <div className="text-slate-900 font-medium">{level.par} Steps</div>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                        <div className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Breaks</div>
                                        <div className="text-slate-900 font-medium">{level.k} Walls</div>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex flex-col justify-center">
                                        <div className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Creator</div>
                                        <div className="text-slate-900 font-medium truncate" title={level.creator}>{level.creator || 'Unknown'}</div>
                                    </div>
                                </div>

                                <button className="w-full py-2 bg-indigo-50 text-indigo-700 font-medium rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                                    Play Level
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            {levels.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
                    <p className="text-slate-500">No levels found. Create one in the Map Builder!</p>
                </div>
            )}
        </div>
    );
}

export default LevelSelector;
