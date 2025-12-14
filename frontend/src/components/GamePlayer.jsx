import React, { useState, useEffect, useCallback, useMemo } from "react";
import { api } from "../api.js";
import { MazeGrid } from "./MazeGrid.jsx";
import { solveMaze } from "../utils/pathSolver.js";

export const GamePlayer = ({
  initialMaze,
  k,
  mode,
  parSteps,
  levelId,
  playerName,
  levelName,
  onExit,
}) => {
  const initialPlayerState = useMemo(() => {
    const start = initialMaze.flat().find((c) => c.type === "start");
    return start ? { r: start.r, c: start.c } : null;
  }, [initialMaze]);

  const [maze, setMaze] = useState(() =>
    initialMaze.map((row) => row.map((cell) => ({ ...cell })))
  );
  const [player, setPlayer] = useState(initialPlayerState);
  const [wallsBroken, setWallsBroken] = useState(0);
  const [visitedCells, setVisitedCells] = useState(() => {
    return initialPlayerState
      ? new Set([`${initialPlayerState.r},${initialPlayerState.c}`])
      : new Set();
  });
  const [gameStatus, setGameStatus] = useState("playing");
  const [message, setMessage] = useState("");
  const [startTime] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [solutionPath, setSolutionPath] = useState([]);

  const maxBreaks = mode === "nwb" ? 0 : k;

  const loadLeaderboard = useCallback(async () => {
    if (!levelId || !mode) return;
    try {
      const response = await api.getLeaderboard(levelId, mode);
      setLeaderboard(response);
    } catch (error) {
      console.error("Error loading leaderboard:", error);
    }
  }, [levelId, mode]);

  const showSolution = () => {
    const result = solveMaze(initialMaze, maxBreaks);
    if (result.reachable) {
      setSolutionPath(result.path);
    } else {
      setMessage("No solution found!");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  // load leaderboard
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadLeaderboard();
  }, [loadLeaderboard]);

  // timer
  useEffect(() => {
    if (gameStatus === "playing") {
      const timer = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStatus, startTime]);

  const handleKeyDown = useCallback(
    (e) => {
      if (gameStatus !== "playing" || !player) return;

      const { r, c } = player;
      let dr = 0;
      let dc = 0;

      const key = e.key.toLowerCase();
      if (e.key === "ArrowUp" || key === "w") dr = -1;
      else if (e.key === "ArrowDown" || key === "s") dr = 1;
      else if (e.key === "ArrowLeft" || key === "a") dc = -1;
      else if (e.key === "ArrowRight" || key === "d") dc = 1;
      else if (e.key === "Enter") {
        // handle Portal
        const cell = maze[r][c];
        if (cell.type === "portal" && cell.portalColor) {
          const dest = maze
            .flat()
            .find(
              (cx) =>
                cx.type === "portal" &&
                cx.portalColor === cell.portalColor &&
                (cx.r !== r || cx.c !== c)
            );

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

      // bounds Check
      if (nr < 0 || nr >= maze.length || nc < 0 || nc >= maze[0].length) return;

      const nextCell = maze[nr][nc];
      const isWall = nextCell.type === "wall";
      const isShift = e.shiftKey;

      // move Logic
      if (isWall) {
        if (isShift && wallsBroken < maxBreaks) {
          // Break Wall
          const newMaze = maze.map((row) => row.map((cl) => ({ ...cl })));
          newMaze[nr][nc].type = "empty";
          setMaze(newMaze);
          setWallsBroken((wb) => wb + 1);

          // Move into broken wall
          setPlayer({ r: nr, c: nc });
          const newVisited = new Set(visitedCells);
          newVisited.add(`${nr},${nc}`);
          setVisitedCells(newVisited);
        } else {
          setMessage(
            isShift ? "No more wall breaks!" : "Blocked! Hold Shift to break."
          );
          setTimeout(() => setMessage(""), 1000);
        }
      } else {
        // Normal Move
        setPlayer({ r: nr, c: nc });
        const newVisited = new Set(visitedCells);
        newVisited.add(`${nr},${nc}`);
        setVisitedCells(newVisited);

        if (nextCell.type === "goal") {
          setGameStatus("won");
          // Submit score
          if (levelId && playerName) {
            const steps = newVisited.size - 1; // Exclude start
            const efficiency = parSteps ? steps / parSteps : steps;
            api
              .submitScore({
                levelId,
                mode,
                playerName,
                steps,
                time: elapsed,
                efficiency,
              })
              .then(() => {
                loadLeaderboard(); // refresh leaderboard
              })
              .catch((err) => console.error("Error submitting score:", err));
          }
        }
      }
    },
    [
      gameStatus,
      player,
      maze,
      wallsBroken,
      maxBreaks,
      visitedCells,
      elapsed,
      levelId,
      playerName,
      parSteps,
      loadLeaderboard,
      mode,
    ]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!player)
    return (
      <div className="p-4 bg-red-50 text-red-800 rounded-lg border border-red-200 m-4">
        Error: No Start Point Found
      </div>
    );

  const steps = visitedCells.size - 1;

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col gap-6">
      {/* Header & Stats Bar */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {levelName || "Playing Level"}
            </h1>
            <div className="text-sm text-slate-500">
              {playerName || "Guest"}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={showSolution}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm"
            >
              Show Solution
            </button>
            <button
              onClick={onExit}
              className="px-3 py-1 bg-slate-200 hover:bg-slate-300 rounded text-slate-700 text-sm"
            >
              Exit
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm justify-center sm:justify-start">
          <div className="font-mono">
            Time: <strong>{elapsed}s</strong>
          </div>
          <div className="font-mono">
            Steps:{" "}
            <strong>
              {steps}
              {parSteps > 0 && `/${parSteps}`}
            </strong>
          </div>
          <div className="font-mono">
            Breaks:{" "}
            <span
              className={
                wallsBroken >= maxBreaks && maxBreaks > 0 ? "text-red-500" : ""
              }
            >
              {wallsBroken}/{maxBreaks}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Main Game Area */}
        <div className="flex-1 relative w-full">
          {message && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-3 py-1 rounded text-sm z-20">
              {message}
            </div>
          )}

          {gameStatus === "won" && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/90 rounded-lg">
              <div className="text-center p-6 bg-white shadow-xl border rounded-xl">
                <div className="text-5xl mb-2">✓</div>
                <h2 className="text-xl font-bold mb-1">Level Complete!</h2>
                <p className="text-slate-600 text-sm mb-4">
                  {elapsed}s • {steps} steps
                </p>
                <button
                  onClick={onExit}
                  className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Back to Menu
                </button>
              </div>
            </div>
          )}

          <MazeGrid maze={maze} player={player} visitedCells={visitedCells} solutionPath={solutionPath} />

          <div className="mt-4 text-xs text-slate-400 text-center">
            Controls: WASD/Arrows to move • Shift+Move to break wall • Enter to
            teleport
          </div>
        </div>

        {/* Leaderboard */}
        {leaderboard.length > 0 && (
          <div className="w-full md:w-64 bg-slate-50 p-4 rounded-lg border border-slate-100 h-fit">
            <h3 className="font-bold text-slate-700 mb-2 text-sm">
              Top Scores
            </h3>
            <ol className="space-y-2 text-sm">
              {leaderboard.slice(0, 5).map((score, i) => (
                <li key={i} className="flex justify-between text-slate-600">
                  <span>
                    {i + 1}. {score.playerName}
                  </span>
                  <span className="font-mono">
                    {score.steps} steps / {score.time}s
                  </span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};
