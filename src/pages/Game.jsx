import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router";
import usePuzzleImage from "../hooks/usePuzzleImage.js";
import useTimer from "../hooks/useTimer.js";
import useStopwatch from "../hooks/useStopwatch.js";
import usePlayer from "../hooks/usePlayer.js";
import GameBoard from "../components/GameBoard.jsx";
import Timer from "../components/Timer.jsx";
import { LEVELS, SHUFFLE_MOVES } from "../config.js";
import { calculateScore } from "../game/scoring.js";
import {
  moveTile,
  isSolved,
  shuffleBoard,
  getTileIndexForArrow,
} from "../game/puzzle.js";

function newBoard(size) {
  return { tiles: shuffleBoard(size, SHUFFLE_MOVES), moves: 0 };
}

// Applies one move to the board state. Returns the same object
// if the move isn't legal, so React skips the re-render.
function applyMove(prev, index, size) {
  if (index < 0) return prev;
  const tiles = moveTile(prev.tiles, index, size);
  if (tiles === prev.tiles) return prev;
  return { tiles, moves: prev.moves + 1 };
}

// Flips between playing and paused. Can't pause before the game starts.
function togglePause(prev) {
  if (prev === "playing") return "paused";
  if (prev === "paused") return "playing";
  return prev;
}

export default function Game() {
  const navigate = useNavigate();
  const { image, status, error, retry } = usePuzzleImage();
  const { level, timed, recordGame } = usePlayer();
  const { size, timeLimit } = LEVELS[level];
  const [board, setBoard] = useState(() => newBoard(size));
  const [useNumbers, setUseNumbers] = useState(false); // offline fallback
  const hasRecorded = useRef(false); // makes sure each game is saved only once

  // "idle" until the first move, then "playing" or "paused".
  const [gameStatus, setGameStatus] = useState("idle");
  const isPlaying = gameStatus === "playing";

  // Both clocks exist (hooks can't be called conditionally),
  // but only the one for the current mode ever runs.
  const { timeRemaining, isExpired, reset: resetTimer } = useTimer(
    timeLimit,
    timed && isPlaying
  );
  const { elapsed, reset: resetStopwatch } = useStopwatch(!timed && isPlaying);

  function handleMove(index) {
    if (gameStatus === "paused") return;
    setBoard((prev) => applyMove(prev, index, size));
    if (gameStatus === "idle") setGameStatus("playing"); // timer starts on first move
  }

  function handleTogglePause() {
    setGameStatus(togglePause);
  }

  function restartGame() {
    setBoard(newBoard(size));
    resetTimer();
    resetStopwatch();
    setGameStatus("idle");
  }

  function handleNewImage() {
    setUseNumbers(false);
    retry();
    restartGame();
  }

  function handlePlayWithNumbers() {
    setUseNumbers(true);
    restartGame();
  }

  const canPlay = status === "ready" || useNumbers;

  // Keyboard: arrows move tiles, P or Escape toggles pause.
  useEffect(() => {
    if (!canPlay) return;

    function handleKeyDown(event) {
      if (event.key === "p" || event.key === "P" || event.key === "Escape") {
        setGameStatus(togglePause);
        return;
      }
      if (!event.key.startsWith("Arrow")) return;
      event.preventDefault(); // stop the page from scrolling
      if (gameStatus === "paused") return;
      setBoard((prev) =>
        applyMove(prev, getTileIndexForArrow(prev.tiles, event.key, size), size)
      );
      if (gameStatus === "idle") setGameStatus("playing");
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canPlay, gameStatus, size]);

  // Auto-pause if the player switches tabs or minimizes the window.
  useEffect(() => {
    if (gameStatus !== "playing") return;

    function handleVisibilityChange() {
      if (document.hidden) setGameStatus("paused");
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [gameStatus]);

  // Saves the result once, then shows Game Over.
  function finishGame(game) {
    if (hasRecorded.current) return;
    hasRecorded.current = true;
    const { isNewHighScore, newAchievements } = recordGame(game);
    navigate("/game-over", {
      replace: true,
      state: { ...game, isNewHighScore, newAchievements },
    });
  }

  // Win and lose checks run after every render (no dependency array),
  // so they always see the latest board and time. The hasRecorded ref
  // inside finishGame keeps a game from being saved twice.

  // Win: board solved.
  useEffect(() => {
    if (board.moves > 0 && isSolved(board.tiles)) {
      finishGame({
        result: "won",
        mode: timed ? "timed" : "relaxed",
        level,
        moves: board.moves,
        time: timed ? timeLimit - timeRemaining : elapsed,
        score: timed ? calculateScore(board.moves, timeRemaining) : null,
      });
    }
  });

  // Lose: time ran out.
  useEffect(() => {
    if (timed && isExpired) {
      finishGame({
        result: "lost",
        mode: "timed",
        level,
        moves: board.moves,
        time: timeLimit,
        score: 0,
      });
    }
  });

  if (status === "loading" && !useNumbers) {
    return (
      <main>
        <Link to="/">Quit to home</Link>
        <p role="status">Fetching your puzzle image…</p>
      </main>
    );
  }

  if (status === "error" && !useNumbers) {
    return (
      <main>
        <Link to="/">Quit to home</Link>
        <h1>Couldn’t load an image</h1>
        <p>{error} Check your connection and try again.</p>
        <div className="home-actions">
          <button type="button" className="button-primary" onClick={retry}>
            Try again
          </button>
          <button type="button" className="button-secondary" onClick={handlePlayWithNumbers}>
            Play with numbered tiles
          </button>
        </div>
      </main>
    );
  }

  const isPaused = gameStatus === "paused";
  const imageUrl = useNumbers ? null : image?.url;

  return (
    <main className="game">
      <div className="game-header">
        <Link to="/">Quit to home</Link>
        <button
          type="button"
          className="button-secondary button-small"
          onClick={handleTogglePause}
          disabled={gameStatus === "idle"}
        >
          {isPaused ? "Resume" : "Pause"}
        </button>
      </div>

      <div className="game-stats">
        {timed ? (
          <Timer seconds={timeRemaining} timeLimit={timeLimit} />
        ) : (
          <Timer seconds={elapsed} />
        )}
        <span className="stat">
          Moves <strong>{board.moves}</strong>
        </span>
      </div>

      <div className="board-wrap">
        <GameBoard
          tiles={board.tiles}
          size={size}
          imageUrl={imageUrl}
          onTileClick={handleMove}
        />

        {isPaused && (
          <div className="pause-overlay">
            <h2>Paused</h2>
            <button type="button" className="button-primary" onClick={handleTogglePause}>
              Resume
            </button>
            <Link to="/">Quit to home</Link>
          </div>
        )}
      </div>

      {gameStatus === "idle" && (
        <p className="hint">
          {timed ? "The timer starts on your first move." : "Relaxed mode: no time limit."}
        </p>
      )}

      <div className="game-footer">
        {imageUrl && (
          <img src={imageUrl} alt="Finished picture" className="goal-preview" />
        )}
        <button type="button" className="button-secondary" onClick={restartGame}>
          Shuffle
        </button>
        <button type="button" className="button-secondary" onClick={handleNewImage}>
          {useNumbers ? "Try images again" : "New image"}
        </button>
      </div>

      {imageUrl ? (
        <p className="credit">
          Photo by{" "}
          <a href={image.sourceUrl} target="_blank" rel="noreferrer">
            {image.author}
          </a>
        </p>
      ) : (
        <p className="credit">Playing offline with numbered tiles. Put them in order, 1 to {size * size - 1}.</p>
      )}
    </main>
  );
}
