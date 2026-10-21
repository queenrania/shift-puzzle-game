// Pure puzzle logic: no React, no DOM. Every function takes data in
// and returns new data out, which makes it easy to test and reuse.
//
// A board is a flat array read left to right, top to bottom.
// Tile values run 1..(size*size - 1). The empty space is 0.
// Solved 3x3: [1, 2, 3, 4, 5, 6, 7, 8, 0]

export function createSolvedBoard(size) {
  const count = size * size;
  return Array.from({ length: count }, (_, i) => (i === count - 1 ? 0 : i + 1));
}

export function isAdjacent(a, b, size) {
  const rowA = Math.floor(a / size);
  const colA = a % size;
  const rowB = Math.floor(b / size);
  const colB = b % size;
  return Math.abs(rowA - rowB) + Math.abs(colA - colB) === 1;
}

// Returns a NEW array with the tile at `index` slid into the empty space,
// or the SAME array if that tile can't move (so callers can detect "no move").
export function moveTile(tiles, index, size) {
  const emptyIndex = tiles.indexOf(0);
  if (!isAdjacent(index, emptyIndex, size)) return tiles;

  return tiles.map((value, i) => {
    if (i === index) return 0;
    if (i === emptyIndex) return tiles[index];
    return value;
  });
}

export function isSolved(tiles) {
  return tiles.every((value, i) => (i === tiles.length - 1 ? value === 0 : value === i + 1));
}

// Shuffles by making random legal moves from the solved state,
// which guarantees the puzzle can always be solved.
export function shuffleBoard(size, moveCount) {
  let tiles = createSolvedBoard(size);
  let previousEmpty = -1;

  for (let n = 0; n < moveCount; n++) {
    const emptyIndex = tiles.indexOf(0);
    const options = tiles
      .map((_, i) => i)
      .filter((i) => isAdjacent(i, emptyIndex, size) && i !== previousEmpty);
    const pick = options[Math.floor(Math.random() * options.length)];
    tiles = moveTile(tiles, pick, size);
    previousEmpty = emptyIndex;
  }

  // Rare, but a random walk can land back on solved. Try again if so.
  return isSolved(tiles) ? shuffleBoard(size, moveCount) : tiles;
}

// Arrow keys move the tile that sits on the opposite side of the empty space,
// so ArrowUp slides the tile below the gap up into it.
export function getTileIndexForArrow(tiles, key, size) {
  const emptyIndex = tiles.indexOf(0);
  const row = Math.floor(emptyIndex / size);
  const col = emptyIndex % size;

  if (key === "ArrowUp" && row < size - 1) return emptyIndex + size;
  if (key === "ArrowDown" && row > 0) return emptyIndex - size;
  if (key === "ArrowLeft" && col < size - 1) return emptyIndex + 1;
  if (key === "ArrowRight" && col > 0) return emptyIndex - 1;
  return -1;
}

// Where a tile's slice of the picture sits, as CSS background-position values.
export function getTileBackgroundPosition(value, size) {
  const home = value - 1;
  const col = home % size;
  const row = Math.floor(home / size);
  const step = 100 / (size - 1);
  return `${col * step}% ${row * step}%`;
}
