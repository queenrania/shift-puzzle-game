import { useState, useEffect } from "react";

// Counts in seconds while isRunning is true. Used for relaxed mode,
// where there's no time limit but so you can see see how long it took.
export default function useStopwatch(isRunning) {
  const [elapsed, setElapsed] = useState(0);

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
