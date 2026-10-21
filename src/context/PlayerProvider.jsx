import { PlayerContext } from "./PlayerContext.js";
import useLocalStorage from "../hooks/useLocalStorage.js";
import { ACHIEVEMENTS } from "../game/achievements.js";
import { LEVELS, MAX_SCORES_PER_LEVEL, STORAGE_KEYS } from "../config.js";

const EMPTY_STATS = { gamesPlayed: 0, highScores: {}, achievements: [] };

function isValidStats(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    Number.isFinite(value.gamesPlayed) &&
    value.highScores !== null &&
    typeof value.highScores === "object" &&
    Array.isArray(value.achievements)
  );
}

const isValidName = (value) => typeof value === "string";
const isValidLevel = (value) => Object.hasOwn(LEVELS, value);
const isValidBoolean = (value) => typeof value === "boolean";

export default function PlayerProvider({ children }) {
  const [playerName, setPlayerName] = useLocalStorage(
    STORAGE_KEYS.playerName,
    "",
    isValidName
  );
  const [level, setLevel] = useLocalStorage(STORAGE_KEYS.level, "easy", isValidLevel);
  const [timed, setTimed] = useLocalStorage(STORAGE_KEYS.timed, true, isValidBoolean);
  const [stats, setStats] = useLocalStorage(STORAGE_KEYS.stats, EMPTY_STATS, isValidStats);

  // Saves one finished game and reports what's new, so Game Over can celebrate.
  function recordGame(game) {
    const won = game.result === "won";
    const ranked = won && game.mode === "timed"; // relaxed games skip the leaderboard
    const levelScores = stats.highScores[game.level] ?? [];
    const gamesPlayed = stats.gamesPlayed + 1;

    const isNewHighScore =
      ranked && (levelScores.length === 0 || game.score > levelScores[0].score);

    const entry = {
      name: playerName.trim() || "Player",
      score: game.score,
      moves: game.moves,
      time: game.time,
      date: new Date().toISOString(),
    };

    const nextLevelScores = ranked
      ? [...levelScores, entry]
          .sort((a, b) => b.score - a.score)
          .slice(0, MAX_SCORES_PER_LEVEL)
      : levelScores;

    const newAchievements = ACHIEVEMENTS.filter(
      (achievement) =>
        !stats.achievements.includes(achievement.id) &&
        achievement.check({ game, gamesPlayed })
    ).map((achievement) => achievement.id);

    setStats({
      gamesPlayed,
      highScores: { ...stats.highScores, [game.level]: nextLevelScores },
      achievements: [...stats.achievements, ...newAchievements],
    });

    return { isNewHighScore, newAchievements };
  }

  function resetStats() {
    setStats(EMPTY_STATS);
  }

  const value = {
    playerName,
    setPlayerName,
    level,
    setLevel,
    timed,
    setTimed,
    stats,
    recordGame,
    resetStats,
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}
