export function createEmptyMaze(rows, cols) {
    const maze = [];
    for (let r = 0; r < rows; r++) {
        const row = [];
        for (let c = 0; c < cols; c++) {
            row.push({ r, c, type: 'empty' });
        }
        maze.push(row);
    }
    return maze;
}

export function findPortals(maze) {
    const portals = {};
    for (const row of maze) {
        for (const cell of row) {
            if (cell.type === 'portal' && cell.portalColor) {
                if (!portals[cell.portalColor]){
                    portals[cell.portalColor] = [];
                }

                portals[cell.portalColor]
                .push({ r: cell.r, c: cell.c });
            }
        }
    }
    return portals;
}