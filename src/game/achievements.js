// Each achievement has a check that looks at the game that just ended
// plus running totals. Add new ones here and they show up everywhere.
export const ACHIEVEMENTS = [
  {
    id: "first-solve",
    title: "First Solve",
    description: "Finish any puzzle",
    check: ({ game }) => game.result === "won",
  },
  {
    id: "under-a-minute",
    title: "Under a Minute",
    description: "Solve a timed game in under 60 seconds",
    check: ({ game }) =>
      game.result === "won" && game.mode === "timed" && game.time < 60,
  },
  {
    id: "high-scorer",
    title: "High Scorer",
    description: "Score 1,500 or more",
    check: ({ game }) =>
      game.result === "won" && game.mode === "timed" && game.score >= 1500,
  },
  {
    id: "efficient",
    title: "Efficient",
    description: "Solve a 3×3 in 40 moves or fewer",
    check: ({ game }) =>
      game.result === "won" && game.level === "easy" && game.moves <= 40,
  },
  {
    id: "grand-master",
    title: "Grand Master",
    description: "Solve a 5×5 puzzle",
    check: ({ game }) => game.result === "won" && game.level === "hard",
  },
  {
    id: "dedicated",
    title: "Dedicated",
    description: "Play 10 games",
    check: ({ gamesPlayed }) => gamesPlayed >= 10,
  },
];

export function getAchievement(id) {
  return ACHIEVEMENTS.find((achievement) => achievement.id === id);
}
