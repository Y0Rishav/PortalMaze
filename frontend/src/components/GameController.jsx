import React, { useState } from "react";
import { MapEditor } from "./MapEditor";
import { GamePlayer } from "./GamePlayer";
import { validateMap } from "../utils/mazeLogic";

export const GameController = ({ playerName, onExit, onPublish }) => {
  const [view, setView] = useState("editor");
  const [gameData, setGameData] = useState(null);

  const startPlay = (maze, k, mode, name) => {
    const result = validateMap(maze, mode === "no-break" ? 0 : k);
    let par = 0;
    if (result.valid) {
      if (mode === "no-break") {
        par = result.zeroBreakSolution?.pathLength || 0;
      } else {
        par = result.kBreakSolution?.pathLength || 0;
      }
    }

    setGameData({ maze, k, mode, par, name });
    setView("play");
  };

  const handleExit = () => {
    setView("editor");
    setGameData(null);
  };

  return (
    <div className="flex flex-col items-center w-full">
      {view === "editor" ? (
        <div className="w-full flex flex-col items-center">
          <MapEditor onPlay={startPlay} onPublish={onPublish} onExit={onExit} />
        </div>
      ) : (
        gameData && (
          <GamePlayer
            initialMaze={gameData.maze}
            k={gameData.k}
            mode={gameData.mode}
            parSteps={gameData.par}
            playerName={playerName}
            levelName={gameData.name}
            onExit={handleExit}
          />
        )
      )}
    </div>
  );
};
