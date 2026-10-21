// Tunable game values live here so they're easy to change in one place.
// Rename the game by changing GAME_TITLE.
export const GAME_TITLE = "Untitled Puzzle";

export const LEVELS = {
  easy: { label: "Easy", size: 3, timeLimit: 120 },
  medium: { label: "Medium", size: 4, timeLimit: 300 },
  hard: { label: "Hard", size: 5, timeLimit: 600 },
};

export const SCORING = {
  base: 1000,
  pointsPerSecondLeft: 10,
  penaltyPerMove: 5,
};

export const SHUFFLE_MOVES = 150;

export const IMAGE_SIZE = 600; // px, requested from the image API

export const MAX_SCORES_PER_LEVEL = 10;

export const STORAGE_KEYS = {
  playerName: "puzzle-game:playerName",
  level: "puzzle-game:level",
  timed: "puzzle-game:timed",
  stats: "puzzle-game:stats",
  currentGame: "puzzle-game:currentGame", // sessionStorage
};
