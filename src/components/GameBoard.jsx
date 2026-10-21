import { isAdjacent, getTileBackgroundPosition } from "../game/puzzle.js";

// Tiles are drawn in by tile number in a fixed order and positioned with CSS transforms.
// Because each tile's DOM element never moves, changing its transform lets CSS animate the slide.
//
// If imageUrl is missing, tiles show numbers instead (offline fallback).
export default function GameBoard({ tiles, size, imageUrl, onTileClick }) {
  const emptyIndex = tiles.indexOf(0);

  // value -> where that tile currently sits on the board
  const positions = tiles.map((value, index) => ({ value, index }))
    .filter((tile) => tile.value !== 0)
    .sort((a, b) => a.value - b.value);

  function placement(index) {
    const row = Math.floor(index / size);
    const col = index % size;
    return `translate(calc(${col} * (100% + var(--gap))), calc(${row} * (100% + var(--gap))))`;
  }

  return (
    <div className="board" style={{ "--size": size }}>
      <div
        className="tile-empty"
        aria-hidden="true"
        style={{ transform: placement(emptyIndex) }}
      />

      {positions.map(({ value, index }) => {
        const movable = isAdjacent(index, emptyIndex, size);
        const classes = ["tile"];
        if (movable) classes.push("tile--movable");
        if (!imageUrl) classes.push("tile--number");

        return (
          <button
            key={value}
            type="button"
            className={classes.join(" ")}
            onClick={() => onTileClick(index)}
            aria-label={movable ? `Tile ${value}, slide into empty space` : `Tile ${value}`}
            style={{
              transform: placement(index),
              ...(imageUrl && {
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: `${size * 100}%`,
                backgroundPosition: getTileBackgroundPosition(value, size),
              }),
            }}
          >
            {!imageUrl && value}
          </button>
        );
      })}
    </div>
  );
}
