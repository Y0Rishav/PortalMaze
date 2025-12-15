import { createEmptyMaze } from "../utils/mazeUtils.js";

export function generateRandomMaze(rows, cols, wallDensity = 0.3) {
  const maze = createEmptyMaze(rows, cols);

  maze[0][0] = { r: 0, c: 0, type: "start" };

  maze[rows - 1][cols - 1] = { r: rows - 1, c: cols - 1, type: "goal" };

  // add random walls
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (
        (r === 0 && c === 0) ||
        (r === rows - 1 && c === cols - 1) ||
        (r === 0 && c === 1) ||
        (r === 1 && c === 0) ||
        (r === rows - 1 && c === cols - 2) ||
        (r === rows - 2 && c === cols - 1)
      ) {
        continue;
      }

      if (Math.random() < wallDensity) {
        maze[r][c] = { r, c, type: "wall" };
      }
    }
  }

  return maze;
}

export const GenerateRandom = {
  generateMaze: generateRandomMaze,
};
