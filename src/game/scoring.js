import { SCORING } from "../config.js";

// More time left and fewer moves means a higher score. Never below zero.
export function calculateScore(moves, secondsLeft) {
  const score =
    SCORING.base +
    secondsLeft * SCORING.pointsPerSecondLeft -
    moves * SCORING.penaltyPerMove;
  return Math.max(0, score);
}
