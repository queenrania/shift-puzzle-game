import { useState, useEffect } from "react";
import { getPuzzleImage } from "../api/picsum.js";

// Fetches a puzzle image and tracks loading and error states.
// status is "loading", "ready", or "error".
// Pass an initialImage (from a resumed game) to skip the first fetch.
export default function usePuzzleImage(initialImage = null) {
  const [image, setImage] = useState(initialImage);
  const [status, setStatus] = useState(initialImage ? "ready" : "loading");
  const [error, setError] = useState(null);
  // -1 means "already have an image, don't fetch yet"
  const [requestId, setRequestId] = useState(initialImage ? -1 : 0);

  useEffect(() => {
    if (requestId < 0) return;

    let ignore = false; // stops a stale request from updating state

    async function load() {
      try {
        const result = await getPuzzleImage();
        if (!ignore) {
          setImage(result);
          setStatus("ready");
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message);
          setStatus("error");
        }
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [requestId]);

  function retry() {
    setStatus("loading");
    setError(null);
    setRequestId((prev) => Math.max(prev, 0) + 1);
  }

  return { image, status, error, retry };
}
