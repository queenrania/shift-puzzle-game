import { Link } from "react-router";
import usePlayer from "../hooks/usePlayer.js";
import { GAME_TITLE, LEVELS } from "../config.js";

export default function Home() {
  const { playerName, setPlayerName, level, setLevel, timed, setTimed } = usePlayer();

  return (
    <main className="home">
      <div className="home-intro">
        <h1>{GAME_TITLE}</h1>
        <p className="tagline">Slide the tiles. Rebuild the picture.</p>
      </div>

      <div className="field">
        <label htmlFor="player-name">Player name</label>
        <input
          id="player-name"
          type="text"
          value={playerName}
          onChange={(event) => setPlayerName(event.target.value)}
          placeholder="Enter your name"
          maxLength={20}
          autoComplete="nickname"
        />
      </div>

      <div className="field">
        <span className="field-label" id="difficulty-label">
          Difficulty
        </span>
        <div className="level-picker" role="group" aria-labelledby="difficulty-label">
          {Object.entries(LEVELS).map(([id, info]) => (
            <button
              key={id}
              type="button"
              className="level-option"
              aria-pressed={level === id}
              onClick={() => setLevel(id)}
            >
              <span className="level-grid">
                {info.size}×{info.size}
              </span>
              <span className="level-label">{info.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <span className="field-label" id="mode-label">
          Mode
        </span>
        <div className="level-picker" role="group" aria-labelledby="mode-label">
          <button
            type="button"
            className="level-option"
            aria-pressed={timed}
            onClick={() => setTimed(true)}
          >
            <span className="level-grid">Timed</span>
            <span className="level-label">Scored, beat the clock</span>
          </button>
          <button
            type="button"
            className="level-option"
            aria-pressed={!timed}
            onClick={() => setTimed(false)}
          >
            <span className="level-grid">Relaxed</span>
            <span className="level-label">No timer, no pressure</span>
          </button>
        </div>
      </div>

      <section className="how-to-play">
        <h2>How to play</h2>
        <ol>
          <li>Tap a tile next to the empty space, or use the arrow keys.</li>
          <li>In Timed mode, rebuild the picture before the clock runs out.</li>
          <li>More time left and fewer moves means a higher score.</li>
          <li>Relaxed mode has no timer and isn’t scored.</li>
          <li>Press P or Escape to pause.</li>
        </ol>
      </section>

      <div className="home-actions">
        <Link to="/game" className="button-primary">
          Start puzzle
        </Link>
        <Link to="/leaderboard" className="button-secondary">
          Leaderboard
        </Link>
      </div>
    </main>
  );
}
