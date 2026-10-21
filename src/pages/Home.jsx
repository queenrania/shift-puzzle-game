import { Link } from "react-router";
import { GAME_TITLE } from "../config.js";

export default function Home() {
  return (
    <main>
      <h1>{GAME_TITLE}</h1>
      <p>Slide the tiles. Rebuild the picture.</p>
      <Link to="/game" className="button-primary">
        Start puzzle
      </Link>{" "}
      <Link to="/leaderboard" className="button-secondary">
        Leaderboard
      </Link>
    </main>
  );
}
