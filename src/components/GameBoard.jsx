import { isAdjacent, getTileBackgroundPosition } from "../game/puzzle.js";

export default function GameBoard({ tiles, size, imageUrl, onTileClick }) {
  const emptyIndex = tiles.indexOf(0);

  return (
    <div
      className="board"
      style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
    >
      {tiles.map((value, index) => {
        if (value === 0) {
          return <div key="empty" className="tile-empty" aria-hidden="true" />;
        }

        const movable = isAdjacent(index, emptyIndex, size);

        return (
          <button
            key={value}
            type="button"
            className={movable ? "tile tile--movable" : "tile"}
            onClick={() => onTileClick(index)}
            aria-label={movable ? `Tile ${value}, slide into empty space` : `Tile ${value}`}
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: `${size * 100}%`,
              backgroundPosition: getTileBackgroundPosition(value, size),
            }}
          />
        );
      })}
    </div>
  );
}
