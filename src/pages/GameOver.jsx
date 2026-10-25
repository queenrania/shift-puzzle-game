import { useLocation, Link, Navigate } from "react-router";
import formatTime from "../game/formatTime.js";
import { getAchievement } from "../game/achievements.js";
import { LEVELS } from "../config.js";

export default function GameOver() {
  const { state } = useLocation();

  // Someone landed here directly: there's no result to show.
  if (!state) {
    return <Navigate to="/" replace />;
  }

  const {
    result,
    mode,
    level,
    score,
    moves,
    time,
    imageUrl,
    isNewHighScore,
    newAchievements = [],
  } = state;
  const won = result === "won";
  const relaxed = mode === "relaxed";
  const levelInfo = LEVELS[level];

  return (
    <main className="game-over">
      {imageUrl && (
        <img src={imageUrl} alt="The picture you solved" className="result-image" />
      )}
      {isNewHighScore && <span className="pill">New high score</span>}
      <h1>{won ? "Solved!" : "Time’s up"}</h1>
      {levelInfo && (
        <p className="tagline">
          {levelInfo.label} · {levelInfo.size}×{levelInfo.size}
          {relaxed ? " · Relaxed" : " · Timed"}
        </p>
      )}

      {won ? (
        <dl className={relaxed ? "result-stats result-stats--two" : "result-stats"}>
          <div>
            <dt>Time</dt>
            <dd>{formatTime(time)}</dd>
          </div>
          <div>
            <dt>Moves</dt>
            <dd>{moves}</dd>
          </div>
          {!relaxed && (
            <div>
              <dt>Score</dt>
              <dd className="accent">{score.toLocaleString()}</dd>
            </div>
          )}
        </dl>
      ) : (
        <p>You made {moves} moves. Give it another go!</p>
      )}

      {won && relaxed && (
        <p className="tagline">Relaxed games aren’t scored. Turn the timer on to compete for the leaderboard.</p>
      )}

      {newAchievements.length > 0 && (
        <section className="unlocked" aria-label="Achievements unlocked">
          {newAchievements.map((id) => {
            const achievement = getAchievement(id);
            if (!achievement) return null;
            return (
              <div key={id} className="unlocked-item">
                <span className="unlocked-label">Achievement unlocked</span>
                <strong>{achievement.title}</strong>
              </div>
            );
          })}
        </section>
      )}

      <div className="home-actions">
        <Link to="/game" className="button-primary">
          {won ? "Play again" : "Try again"}
        </Link>
        <Link to="/leaderboard" className="button-secondary">
          Leaderboard
        </Link>
        <Link to="/" className="button-secondary">
          Home
        </Link>
      </div>
    </main>
  );
}
