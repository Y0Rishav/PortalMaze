import { findPortals } from './mazeUtils.js';
import { solveMaze } from './pathSolver.js';

export function validateMap(maze, k) {
    const portals = findPortals(maze);
    const errors = [];

    // checker so that only one start and goal
    let startCount = 0;
    let goalCount = 0;
    maze.flat().forEach(c => {
        if (c.type === 'start') startCount++;
        if (c.type === 'goal') goalCount++;
    });

    if (startCount !== 1) errors.push("Map must have exactly one Start.");
    if (goalCount !== 1) errors.push("Map must have exactly one Goal.");

    // checker for portals pairs)
    for (const [color, locs] of Object.entries(portals)) {
        if (locs.length !== 2) {
            errors.push(`Portal ${color} must have exactly 2 locations. Found ${locs.length}.`);
        }
    }

    if (errors.length > 0) {
        return { valid: false, errors };
    }

    // checker for reachability
    // 1. shortest no brk
    const resultZero = solveMaze(maze, 0);

    // 2. shortest K brks
    const resultK = solveMaze(maze, k);

    if (!resultK.reachable) {
        return { valid: false, errors: ["Goal is not reachable even with K wall breaks."] };
    }

    return {
        valid: true,
        errors: [],
        zeroBreakSolution: resultZero,
        kBreakSolution: resultK
    };
}