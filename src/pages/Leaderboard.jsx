import { useState } from "react";
import { Link } from "react-router";
import usePlayer from "../hooks/usePlayer.js";
import formatTime from "../game/formatTime.js";
import { ACHIEVEMENTS } from "../game/achievements.js";
import { LEVELS } from "../config.js";

export default function Leaderboard() {
  const { stats, level: lastLevel, resetStats } = usePlayer();
  const [tab, setTab] = useState(lastLevel);

  const scores = stats.highScores[tab] ?? [];
  const unlockedCount = stats.achievements.length;

  function handleReset() {
    if (window.confirm("Clear all scores, achievements, and games played?")) {
      resetStats();
    }
  }

  return (
    <main className="leaderboard">
      <Link to="/">Back to home</Link>
      <h1>Leaderboard</h1>
      <p className="tagline">Games played: {stats.gamesPlayed}</p>

      <div className="tabs" role="group" aria-label="Difficulty">
        {Object.entries(LEVELS).map(([id, info]) => (
          <button
            key={id}
            type="button"
            className="tab"
            aria-pressed={tab === id}
            onClick={() => setTab(id)}
          >
            {info.size}×{info.size}
          </button>
        ))}
      </div>

      {scores.length === 0 ? (
        <p className="empty">No {LEVELS[tab].label.toLowerCase()} scores yet. Finish a puzzle to get on the board.</p>
      ) : (
        <table className="scores">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Player</th>
              <th scope="col">Time</th>
              <th scope="col">Moves</th>
              <th scope="col">Score</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((entry, index) => (
              <tr key={entry.date}>
                <td>{index + 1}</td>
                <td className="name">{entry.name}</td>
                <td>{formatTime(entry.time)}</td>
                <td>{entry.moves}</td>
                <td className="score">{entry.score.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <section>
        <div className="section-heading">
          <h2>Achievements</h2>
          <span className="tagline">
            {unlockedCount} of {ACHIEVEMENTS.length}
          </span>
        </div>
        <ul className="achievements">
          {ACHIEVEMENTS.map((achievement) => {
            const unlocked = stats.achievements.includes(achievement.id);
            return (
              <li
                key={achievement.id}
                className={unlocked ? "achievement" : "achievement achievement--locked"}
              >
                <strong>{achievement.title}</strong>
                <span>{achievement.description}</span>
                <span className="achievement-status">{unlocked ? "Unlocked" : "Locked"}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="home-actions">
        <Link to="/game" className="button-primary">
          Play
        </Link>
        <button type="button" className="button-secondary" onClick={handleReset}>
          Reset scores
        </button>
      </div>
    </main>
  );
}
