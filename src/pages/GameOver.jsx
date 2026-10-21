import { useLocation, Link, Navigate } from "react-router";

export default function GameOver() {
  const { state } = useLocation();

  // Someone landed here directly or refreshed: there's no result to show.
  if (!state) {
    return <Navigate to="/" replace />;
  }

  const { score, moves, time } = state;

  return (
    <main>
      <h1>Solved!</h1>
      <p>Time: {time}s</p>
      <p>Moves: {moves}</p>
      <p>Score: {score}</p>
      <Link to="/game" className="button-primary">
        Play again
      </Link>{" "}
      <Link to="/leaderboard" className="button-secondary">
        Leaderboard
      </Link>
    </main>
  );
}
