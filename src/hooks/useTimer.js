import { useState, useEffect } from "react";

// A countdown that ticks once a second while isRunning is true.
// It stops on its own at zero and reports isExpired.
// startAt lets a resumed game pick up where it left off.
export default function useTimer(initialSeconds, isRunning, startAt = initialSeconds) {
  const [timeRemaining, setTimeRemaining] = useState(startAt);
  const isExpired = timeRemaining === 0;

  useEffect(() => {
    if (!isRunning || isExpired) return;

    const intervalId = setInterval(() => {
      // Functional update: always counts down from the latest value,
      // never a stale one captured when the interval started.
      setTimeRemaining((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isRunning, isExpired]);

  function reset() {
    setTimeRemaining(initialSeconds);
  }

  return { timeRemaining, isExpired, reset };
}
