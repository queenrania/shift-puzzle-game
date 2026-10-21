import { useState, useEffect } from "react";

// Counts up once a second while isRunning is true. Used for relaxed mode,
// where there's no time limit but it's still fun to see how long you took.
// startAt lets a resumed game pick up where it left off.
export default function useStopwatch(isRunning, startAt = 0) {
  const [elapsed, setElapsed] = useState(startAt);

  useEffect(() => {
    if (!isRunning) return;

    const intervalId = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isRunning]);

  function reset() {
    setElapsed(0);
  }

  return { elapsed, reset };
}
