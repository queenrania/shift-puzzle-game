import { useState, useEffect } from "react";

// Reads a saved value once, falls back to initialValue if nothing is saved
// or the saved data is broken, and saves again whenever the value changes.
// isValid (optional) rejects data that parses but has the wrong shape.
function readStoredValue(key, initialValue, isValid) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return initialValue;
    const parsed = JSON.parse(raw);
    if (isValid && !isValid(parsed)) {
      console.warn(`Ignoring invalid saved data for "${key}".`);
      return initialValue;
    }
    return parsed;
  } catch {
    console.warn(`Ignoring corrupted saved data for "${key}".`);
    return initialValue;
  }
}

export default function useLocalStorage(key, initialValue, isValid) {
  const [value, setValue] = useState(() =>
    readStoredValue(key, initialValue, isValid)
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage can be full or blocked (some private browsing modes).
      // The game still works, it just won't remember this session.
    }
  }, [key, value]);

  return [value, setValue];
}
