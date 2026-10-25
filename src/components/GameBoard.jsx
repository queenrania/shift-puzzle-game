import { isAdjacent, getTileBackgroundPosition } from "../game/puzzle.js";

// Tiles are drawn in a fixed order (by tile number) and positioned with
// CSS transforms. Because each tile's DOM element never moves, changing its
// transform lets CSS animate the slide.
//
// If imageUrl is missing, tiles show their numbers instead (offline fallback).
// When solved, the gaps close and the missing last piece fades in.
export default function GameBoard({ tiles, size, imageUrl, onTileClick, solved = false }) {
  const emptyIndex = tiles.indexOf(0);
  const lastValue = size * size;

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
    <div className={solved ? "board board--solved" : "board"} style={{ "--size": size }}>
      {solved ? (
        <div
          className={imageUrl ? "tile tile--final" : "tile tile--final tile--number"}
          aria-hidden="true"
          style={{
            transform: placement(emptyIndex),
            ...(imageUrl && {
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: `${size * 100}%`,
              backgroundPosition: getTileBackgroundPosition(lastValue, size),
            }),
          }}
        >
          {!imageUrl && lastValue}
        </div>
      ) : (
        <div
          className="tile-empty"
          aria-hidden="true"
          style={{ transform: placement(emptyIndex) }}
        />
      )}

      {positions.map(({ value, index }) => {
        const movable = !solved && isAdjacent(index, emptyIndex, size);
        const classes = ["tile"];
        if (movable) classes.push("tile--movable");
        if (!imageUrl) classes.push("tile--number");

        return (
          <button
            key={value}
            type="button"
            className={classes.join(" ")}
            onClick={() => onTileClick(index)}
            disabled={solved}
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
