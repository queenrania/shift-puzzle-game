import formatTime from "../game/formatTime.js";

const WARNING_SECONDS = 15;

// Timed mode: counts down with a progress bar.
// Relaxed mode (no timeLimit): just shows how long you've been playing.
export default function Timer({ seconds, timeLimit }) {
  if (!timeLimit) {
    return (
      <div className="timer">
        <span className="stat">
          Time <strong className="timer-value">{formatTime(seconds)}</strong>
        </span>
      </div>
    );
  }

  const percent = (seconds / timeLimit) * 100;
  const isLow = seconds <= WARNING_SECONDS;

  return (
    <div className="timer">
      <span className="stat">
        Time left{" "}
        <strong className={isLow ? "timer-value timer-value--low" : "timer-value"}>
          {formatTime(seconds)}
        </strong>
      </span>
      <div
        className="timer-bar"
        role="progressbar"
        aria-label="Time remaining"
        aria-valuemin={0}
        aria-valuemax={timeLimit}
        aria-valuenow={seconds}
      >
        <div
          className={isLow ? "timer-fill timer-fill--low" : "timer-fill"}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
