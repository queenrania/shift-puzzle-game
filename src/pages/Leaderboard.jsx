import { Link } from "react-router";

export default function Leaderboard() {
  return (
    <main>
      <Link to="/">Back to home</Link>
      <h1>Leaderboard</h1>
      <p>No scores yet. Finish a puzzle to get on the board.</p>
    </main>
  );
}
