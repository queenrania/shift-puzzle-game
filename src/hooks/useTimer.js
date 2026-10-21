import { useState, useEffect } from "react";

// A countdown that ticks once a second while isRunning is true.
// It stops on its own at zero and reports isExpired.
export default function useTimer(initialSeconds, isRunning) {
  const [timeRemaining, setTimeRemaining] = useState(initialSeconds);
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
