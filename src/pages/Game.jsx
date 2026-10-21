import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import usePuzzleImage from "../hooks/usePuzzleImage.js";
import GameBoard from "../components/GameBoard.jsx";
import { LEVELS, SCORING, SHUFFLE_MOVES } from "../config.js";
import {
  moveTile,
  isSolved,
  shuffleBoard,
  getTileIndexForArrow,
} from "../game/puzzle.js";

const level = "easy"; // becomes the player's choice once Home has a picker
const { size } = LEVELS[level];

function newBoard() {
  return { tiles: shuffleBoard(size, SHUFFLE_MOVES), moves: 0 };
}

// Applies one move to the board state. Returns the same object
// if the move isn't legal, so React skips the re-render.
function applyMove(prev, index) {
  if (index < 0) return prev;
  const tiles = moveTile(prev.tiles, index, size);
  if (tiles === prev.tiles) return prev;
  return { tiles, moves: prev.moves + 1 };
}

export default function Game() {
  const navigate = useNavigate();
  const { image, status, error, retry } = usePuzzleImage();
  const [board, setBoard] = useState(newBoard);

  function handleTileClick(index) {
    setBoard((prev) => applyMove(prev, index));
  }

  function handleNewImage() {
    retry();
    setBoard(newBoard());
  }

  // Arrow key controls, only while the puzzle is on screen.
  useEffect(() => {
    if (status !== "ready") return;

    function handleKeyDown(event) {
      if (!event.key.startsWith("Arrow")) return;
      event.preventDefault(); // stop the page from scrolling
      setBoard((prev) =>
        applyMove(prev, getTileIndexForArrow(prev.tiles, event.key, size))
      );
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [status]);

  // Win detection: when the board is solved, go to Game Over.
  useEffect(() => {
    if (board.moves > 0 && isSolved(board.tiles)) {
      navigate("/game-over", {
        replace: true,
        state: {
          level,
          moves: board.moves,
          time: 0, // filled in once the timer exists
          score: Math.max(0, SCORING.base - board.moves * SCORING.penaltyPerMove),
        },
      });
    }
  }, [board, navigate]);

  if (status === "loading") {
    return (
      <main>
        <Link to="/">Quit to home</Link>
        <p role="status">Fetching your puzzle image…</p>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main>
        <Link to="/">Quit to home</Link>
        <h1>Couldn’t load an image</h1>
        <p>{error} Check your connection and try again.</p>
        <button type="button" className="button-primary" onClick={retry}>
          Try again
        </button>
      </main>
    );
  }

  return (
    <main className="game">
      <div className="game-header">
        <Link to="/">Quit to home</Link>
        <span className="stat">
          Moves <strong>{board.moves}</strong>
        </span>
      </div>

      <GameBoard
        tiles={board.tiles}
        size={size}
        imageUrl={image.url}
        onTileClick={handleTileClick}
      />

      <div className="game-footer">
        <img src={image.url} alt="Finished picture" className="goal-preview" />
        <button type="button" className="button-secondary" onClick={() => setBoard(newBoard())}>
          Shuffle
        </button>
        <button type="button" className="button-secondary" onClick={handleNewImage}>
          New image
        </button>
      </div>

      <p className="credit">
        Photo by{" "}
        <a href={image.sourceUrl} target="_blank" rel="noreferrer">
          {image.author}
        </a>
      </p>
    </main>
  );
}
