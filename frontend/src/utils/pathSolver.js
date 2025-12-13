import { findPortals } from './mazeUtils';

const DIRECTIONS = [
    [-1, 0], [1, 0], [0, -1], [0, 1]
];

export function solveMaze(maze, maxBreaks) {
    const rows = maze.length;
    const cols = maze[0].length;
    let start = null;
    let goal = null;

    // find start and goal pos
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (maze[r][c].type === 'start') start = { r, c };
            if (maze[r][c].type === 'goal') goal = { r, c };
        }
    }

    if (!start || !goal) {
        return { reachable: false, pathLength: 0, path: [], error: "Missing Start or Goal" };
    }

    const portals = findPortals(maze);
    const visited = new Set();
    const queue = [];

    // BFS
    queue.push({
        r: start.r,
        c: start.c,
        breaks: 0,
        dist: 0,
        path: [{ r: start.r, c: start.c }]
    });

    visited.add(`${start.r},${start.c},0`);

    while (queue.length > 0) {
        const { r, c, breaks, dist, path } = queue.shift();

        // check if goal reached
        if (r === goal.r && c === goal.c) {
            return { reachable: true, pathLength: dist, path };
        }

        // get all possible next pos dir + portal
        const nextPositions = getNextPositions(maze, r, c, breaks, maxBreaks, portals);

        for (const { nr, nc, newBreaks } of nextPositions) {
            const key = `${nr},${nc},${newBreaks}`;
            if (!visited.has(key)) {
                visited.add(key);
                queue.push({
                    r: nr,
                    c: nc,
                    breaks: newBreaks,
                    dist: dist + 1,
                    path: [...path, { r: nr, c: nc }]
                });
            }
        }
    }

    return { reachable: false, pathLength: 0, path: [], error: "No path found" };
}

function getNextPositions(maze, r, c, breaks, maxBreaks, portals) {
    const positions = [];
    const rows = maze.length;
    const cols = maze[0].length;

    // physical moves
    for (const [dr, dc] of DIRECTIONS) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            const cell = maze[nr][nc];
            let newBreaks = breaks;
            let canMove = true;

            if (cell.type === 'wall') {
                if (breaks < maxBreaks) {
                    newBreaks = breaks + 1;
                } else {
                    canMove = false;
                }
            }

            if (canMove) {
                positions.push({ nr, nc, newBreaks });
            }
        }
    }

    // portal tp
    const cell = maze[r][c];
    if (cell.type === 'portal' && cell.portalColor) {
        const pair = portals[cell.portalColor];
        if (pair && pair.length === 2) {
            const dest = pair.find(p => p.r !== r || p.c !== c);
            if (dest) {
                positions.push({ 
                    nr: dest.r,
                    nc: dest.c,
                    newBreaks: breaks 
                }); // tp ke leye no brk cost
            }
        }
    }

    return positions;
}