export const MazeGrid = ({
  maze,
  player = null,
  visitedCells = new Set(),
  onCellClick = null,
  solutionPath = [],
}) => {
  if (!maze || !maze.length) return null;

  const rows = maze.length;
  const cols = maze[0].length;

  return (
    <div
      className="bg-white p-1 rounded-xl shadow-lg border border-slate-200 overflow-hidden mx-auto w-full"
      style={{ maxWidth: `calc(64vh * ${cols / rows})` }}
    >
      <div
        className="grid gap-px bg-slate-200 border border-slate-200"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          aspectRatio: `${cols}/${rows}`,
          touchAction: "none",
        }}
      >
        {maze.map((row, rIndex) =>
          row.map((cell, cIndex) => {
            let content = "";
            let bgClass = "bg-white";
            let textClass = "text-slate-400";
            let scaleClass = "";
            let shadowClass = "";

            const isInteractive = !!onCellClick;
            if (isInteractive) {
              bgClass += " hover:bg-indigo-50";
            }

            if (cell.type === "wall") {
              bgClass = isInteractive
                ? "bg-slate-800 hover:bg-slate-700"
                : "bg-slate-800";
              shadowClass = "inset-shadow-sm";
            }

            if (cell.type === "start") {
              content = "S";
              bgClass = "bg-emerald-500";
              textClass = "text-white font-bold";
              scaleClass = "scale-90 rounded-sm";
            }

            if (cell.type === "goal") {
              content = "G";
              bgClass = "bg-rose-500";
              textClass = "text-white font-bold";
              scaleClass = "scale-90 rounded-sm shadow-md shadow-rose-200";
            }

            if (cell.type === "portal") {
              if (cell.portalColor === "blue") bgClass = "bg-indigo-500";
              else if (cell.portalColor === "red") bgClass = "bg-rose-500";
              else if (cell.portalColor === "green") bgClass = "bg-emerald-500";
              else if (cell.portalColor === "purple") bgClass = "bg-purple-500";
              textClass = "text-white";
              scaleClass = "rounded-full scale-75 shadow-sm ring-2 ring-white";
            }

            // vis cells
            if (visitedCells.has(`${cell.r},${cell.c}`)) {
              if (
                cell.type !== "start" &&
                cell.type !== "goal" &&
                cell.type !== "portal"
              ) {
                bgClass = "bg-indigo-50";
              }
            }

            // sol overlay
            const isSolution = solutionPath?.some(
              (p) => p.r === rIndex && p.c === cIndex
            );

            let overlay = null;
            if (isSolution) {
              overlay = (
                <div className="absolute inset-0 border-7 border-green-500 opacity-90 pointer-events-none"></div>
              );
            }

            // Player Token
            const isPlayer =
              player && player.r === cell.r && player.c === cell.c;

            return (
              <div
                key={`${rIndex}-${cIndex}`}
                className={`aspect-square relative flex items-center justify-center transition-colors duration-150 ${bgClass} ${textClass} ${shadowClass} ${
                  isInteractive ? "cursor-pointer" : ""
                }`}
                onClick={() => onCellClick && onCellClick(rIndex, cIndex)}
              >
                {scaleClass ? (
                  <div
                    className={`w-full h-full flex items-center justify-center transform ${scaleClass}`}
                  >
                    {content}
                  </div>
                ) : (
                  content
                )}

                {overlay}

                {isPlayer && (
                  <div className="absolute inset-1 bg-indigo-600 rounded-full shadow-lg shadow-indigo-300 transform scale-90 z-10 transition-all duration-200"></div>
                )}
              </div>
            );
          })
        )}
      </div>
      {onCellClick && (
        <p className="text-center text-slate-400 text-sm mt-4">
          Click cells to edit • Use sidebar to switch tools
        </p>
      )}
    </div>
  );
};
