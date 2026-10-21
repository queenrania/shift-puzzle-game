import { LEVELS, STORAGE_KEYS } from "../config.js";

// The in-progress puzzle lives in sessionStorage, which only lasts for the
// current browser tab. A refresh brings the game back; closing the tab
// (or going back to Home) ends it.

function isValidTiles(tiles, size) {
  if (!Array.isArray(tiles) || tiles.length !== size * size) return false;
  const sorted = [...tiles].sort((a, b) => a - b);
  return sorted.every((value, i) => value === i);
}

function isValidImage(image) {
  return image === null || (typeof image === "object" && typeof image.url === "string");
}

// Returns the saved game only if it matches the current settings
// and every field looks right. Anything else is treated as no save.
export function loadSavedGame(level, timed) {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEYS.currentGame);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    const levelInfo = LEVELS[level];

    const valid =
      saved !== null &&
      typeof saved === "object" &&
      saved.level === level &&
      saved.timed === timed &&
      isValidTiles(saved.tiles, levelInfo.size) &&
      Number.isInteger(saved.moves) &&
      saved.moves >= 0 &&
      Number.isInteger(saved.timeRemaining) &&
      saved.timeRemaining > 0 &&
      saved.timeRemaining <= levelInfo.timeLimit &&
      Number.isInteger(saved.elapsed) &&
      saved.elapsed >= 0 &&
      typeof saved.useNumbers === "boolean" &&
      isValidImage(saved.image);

    return valid ? saved : null;
  } catch {
    return null;
  }
}

export function saveGame(game) {
  try {
    window.sessionStorage.setItem(STORAGE_KEYS.currentGame, JSON.stringify(game));
  } catch {
    // Storage blocked or full: resume just won't be available.
  }
}

export function clearSavedGame() {
  try {
    window.sessionStorage.removeItem(STORAGE_KEYS.currentGame);
  } catch {
    // Nothing to clear.
  }
}
