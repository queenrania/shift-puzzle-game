import { Routes, Route, Navigate } from "react-router";
import Home from "./pages/Home.jsx";
import Game from "./pages/Game.jsx";
import GameOver from "./pages/GameOver.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";

export default function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/game-over" element={<GameOver />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        {/* Any unknown URL goes back home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
