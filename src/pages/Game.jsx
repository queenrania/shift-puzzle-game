import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router";
import usePuzzleImage from "../hooks/usePuzzleImage.js";
import useTimer from "../hooks/useTimer.js";
import useStopwatch from "../hooks/useStopwatch.js";
import usePlayer from "../hooks/usePlayer.js";
import GameBoard from "../components/GameBoard.jsx";
import Timer from "../components/Timer.jsx";
import ImagePreview from "../components/ImagePreview.jsx";
import { LEVELS, SHUFFLE_MOVES } from "../config.js";
import { calculateScore } from "../game/scoring.js";
import {
  moveTile,
  isSolved,
  shuffleBoard,
  getTileIndexForArrow,
} from "../game/puzzle.js";
import { loadSavedGame, saveGame, clearSavedGame } from "../game/savedGame.js";

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
  const { level, timed, recordGame } = usePlayer();
  const { size, timeLimit } = LEVELS[level];

  // If the page was refreshed mid-game, pick up where the player left off.
  const [saved] = useState(() => loadSavedGame(level, timed));

  const { image, status, error, retry } = usePuzzleImage(saved?.image ?? null);
  const [board, setBoard] = useState(() =>
    saved ? { tiles: saved.tiles, moves: saved.moves } : newBoard(size)
  );
  const [useNumbers, setUseNumbers] = useState(saved?.useNumbers ?? false);
  const hasRecorded = useRef(false); // makes sure each game is saved only once
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // "idle" until the first move, then "playing" or "paused".
  // A resumed game starts paused so the clock doesn't run while the page reloads.
  const [gameStatus, setGameStatus] = useState(
    saved && saved.moves > 0 ? "paused" : "idle"
  );
  const isPlaying = gameStatus === "playing";

  // Both clocks exist (hooks can't be called conditionally),
  // but only the one for the current mode ever runs.
  const { timeRemaining, isExpired, reset: resetTimer } = useTimer(
    timeLimit,
    timed && isPlaying,
    saved?.timeRemaining
  );
  const { elapsed, reset: resetStopwatch } = useStopwatch(
    !timed && isPlaying,
    saved?.elapsed
  );

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
    clearSavedGame(); // the old picture shouldn't come back on refresh
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
    if (!canPlay || isPreviewOpen) return; // the preview handles its own keys

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
  }, [canPlay, isPreviewOpen, gameStatus, size]);

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

  // Keep a copy of the game in progress so a refresh can resume it.
  useEffect(() => {
    if (!canPlay || hasRecorded.current || isSolved(board.tiles)) return;
    saveGame({
      level,
      timed,
      tiles: board.tiles,
      moves: board.moves,
      timeRemaining,
      elapsed,
      useNumbers,
      image: useNumbers ? null : image,
    });
  }, [canPlay, board, timeRemaining, elapsed, useNumbers, image, level, timed]);

  // Saves the result once, then shows Game Over.
  function finishGame(game) {
    if (hasRecorded.current) return;
    hasRecorded.current = true;
    clearSavedGame();
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
          <button
            type="button"
            className="goal-preview"
            onClick={() => setIsPreviewOpen(true)}
            disabled={isPaused}
            aria-label="View the finished picture larger"
          >
            <img src={imageUrl} alt="" />
            <svg
              className="goal-preview-icon"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="6" />
              <path d="M20 20l-4.5-4.5" />
            </svg>
          </button>
        )}
        <button type="button" className="button-secondary" onClick={restartGame}>
          Shuffle
        </button>
        <button type="button" className="button-secondary" onClick={handleNewImage}>
          {useNumbers ? "Try images again" : "New image"}
        </button>
      </div>

      {imageUrl && (
        <ImagePreview
          imageUrl={imageUrl}
          open={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}

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
