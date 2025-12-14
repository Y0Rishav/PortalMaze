import React, { useState } from "react";
import { createEmptyMaze, validateMap } from "../utils/mazeLogic.js";
import { MazeGrid } from "./MazeGrid.jsx";

const PORTAL_COLORS = ["blue", "red", "green", "purple"];

export const MapEditor = ({ onPlay, onPublish, onExit }) => {
  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(10);
  const [maze, setMaze] = useState(() => createEmptyMaze(10, 10));
  const [k, setK] = useState(0);
  const [selectedTool, setSelectedTool] = useState("wall");
  const [selectedPortalColor, setSelectedPortalColor] = useState("blue");
  const [validationResult, setValidationResult] = useState(null);
  const [levelName, setLevelName] = useState("");
  const [levelDescription, setLevelDescription] = useState("");

  const handleDimensionChange = (r, c) => {
    const nr = Math.max(5, Math.min(30, Number(r)));
    const nc = Math.max(5, Math.min(30, Number(c)));
    setRows(nr);
    setCols(nc);
    setMaze(createEmptyMaze(nr, nc));
    setValidationResult(null);
  };

  const handleCellClick = (r, c) => {
    const newMaze = maze.map((row) => row.map((cell) => ({ ...cell })));
    let cell = newMaze[r][c];

    // Ensure only one Start/Goal
    if (selectedTool === "start") {
      newMaze.forEach((row) =>
        row.forEach((cx) => {
          if (cx.type === "start") cx.type = "empty";
        })
      );
    }
    if (selectedTool === "goal") {
      newMaze.forEach((row) =>
        row.forEach((cx) => {
          if (cx.type === "goal") cx.type = "empty";
        })
      );
    }

    // Apply tool
    if (selectedTool === "portal") {
      cell.type = "portal";
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
        parNWB: validationResult.zeroBreakSolution?.pathLength || 0,
        parWB: validationResult.kBreakSolution?.pathLength || 0,
      });
    }
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto p-4 flex flex-col gap-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Level Editor</h1>
          <p className="text-slate-500 text-sm">Design your level</p>
        </div>
        {onExit && (
          <button
            onClick={onExit}
            className="px-3 py-1 bg-slate-200 hover:bg-slate-300 rounded text-slate-700 text-sm"
          >
            Exit
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Left Column: Tools & Controls */}
        <div className="w-full md:w-64 flex flex-col gap-6 shrink-0 order-2 md:order-1">
          {/* Construction Tools */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">
              Grid Size
            </h3>
            <div className="flex gap-2 mb-4">
              <div className="flex flex-col gap-1 w-1/2">
                <label className="text-xs text-slate-500">Rows</label>
                <input
                  type="number"
                  min="2"
                  max="30"
                  value={rows}
                  onChange={(e) => handleDimensionChange(e.target.value, cols)}
                  className="p-1 border rounded text-sm w-full"
                />
              </div>
              <div className="flex flex-col gap-1 w-1/2">
                <label className="text-xs text-slate-500">Cols</label>
                <input
                  type="number"
                  min="2"
                  max="30"
                  value={cols}
                  onChange={(e) => handleDimensionChange(rows, e.target.value)}
                  className="p-1 border rounded text-sm w-full"
                />
              </div>
            </div>

            <h3 className="text-sm font-semibold text-slate-700 mb-2">Tools</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "wall", label: "Wall" },
                { id: "empty", label: "Eraser" },
                { id: "start", label: "Start" },
                { id: "goal", label: "Goal" },
              ].map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool.id)}
                  className={`px-2 py-2 rounded border text-sm font-medium ${
                    selectedTool === tool.id
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {tool.label}
                </button>
              ))}
            </div>

            <h3 className="text-sm font-semibold text-slate-700 mt-4 mb-2">
              Portals
            </h3>
            <div className="flex gap-2">
              {PORTAL_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    setSelectedTool("portal");
                    setSelectedPortalColor(color);
                  }}
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedTool === "portal" && selectedPortalColor === color
                      ? "border-slate-800 scale-110"
                      : "border-white"
                  }`}
                  style={{
                    backgroundColor:
                      color === "blue"
                        ? "#6366f1"
                        : color === "red"
                        ? "#f43f5e"
                        : color === "green"
                        ? "#10b981"
                        : "#a855f7",
                  }}
                  title={color}
                />
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200">
              <label className="text-sm font-semibold text-slate-700 mb-1 block">
                Wall Breaks (K): {k}
              </label>
              <input
                type="range"
                min="0"
                max={rows * cols}
                value={k}
                onChange={(e) => setK(Math.max(0, Number(e.target.value)))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>0</span>
                <span>{rows * cols}</span>
              </div>
            </div>
          </div>

          {/* Validation & Actions */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            {!validationResult ? (
              <button
                onClick={runValidation}
                className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 font-medium text-sm"
              >
                Check Solvability
              </button>
            ) : (
              <div
                className={`p-3 rounded text-sm ${
                  validationResult.valid
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-rose-100 text-rose-800"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <strong>
                    {validationResult.valid ? "✓ Valid Map" : "✕ Invalid Map"}
                  </strong>
                  <button
                    onClick={() => setValidationResult(null)}
                    className="text-xs underline opacity-70 hover:opacity-100"
                  >
                    Reset
                  </button>
                </div>

                {!validationResult.valid && (
                  <ul className="list-disc pl-4 space-y-1 text-xs">
                    {validationResult.errors.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                )}

                {validationResult.valid && (
                  <div className="flex justify-between text-xs mt-2">
                    <span>
                      No-Break:{" "}
                      <strong>
                        {validationResult.zeroBreakSolution?.reachable
                          ? validationResult.zeroBreakSolution.pathLength
                          : "-"}
                      </strong>
                    </span>
                    <span>
                      K-Break:{" "}
                      <strong>
                        {validationResult.kBreakSolution?.reachable
                          ? validationResult.kBreakSolution.pathLength
                          : "-"}
                      </strong>
                    </span>
                  </div>
                )}
              </div>
            )}

            {validationResult?.valid && (
              <div className="space-y-3 pt-3 mt-3 border-t border-slate-200 animate-in fade-in">
                {onPlay && (
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        onPlay(maze, k, "no-break", levelName || "Test")
                      }
                      className="flex-1 py-1 bg-white border border-slate-300 rounded text-xs hover:bg-slate-50"
                    >
                      Test Normal
                    </button>
                    <button
                      onClick={() =>
                        onPlay(maze, k, "wall-break", levelName || "Test")
                      }
                      className="flex-1 py-1 bg-white border border-slate-300 rounded text-xs hover:bg-slate-50"
                    >
                      Test Break
                    </button>
                  </div>
                )}
                <input
                  type="text"
                  placeholder="Level Name"
                  value={levelName}
                  onChange={(e) => setLevelName(e.target.value)}
                  className="w-full p-2 text-sm border rounded bg-white"
                />
                <textarea
                  placeholder="Description"
                  rows="2"
                  value={levelDescription}
                  onChange={(e) => setLevelDescription(e.target.value)}
                  className="w-full p-2 text-sm border rounded bg-white"
                />
                <button
                  disabled={!levelName.trim() || !levelDescription.trim()}
                  onClick={handlePublish}
                  className="w-full py-2 bg-emerald-600 text-white rounded font-medium disabled:opacity-50 hover:bg-emerald-700 text-sm"
                >
                  Publish Level
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Maze Grid */}
        <div className="flex-1 w-full order-1 md:order-2">
          <MazeGrid
            maze={maze}
            onCellClick={handleCellClick}
          />
        </div>
      </div>
    </div>
  );
};
