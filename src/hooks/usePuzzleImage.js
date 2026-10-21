import { useState, useEffect } from "react";
import { getPuzzleImage } from "../api/picsum.js";

// Fetches a puzzle image and tracks loading and error states with status is "loading", "ready", or "error".
export default function usePuzzleImage() {
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [requestId, setRequestId] = useState(0);

  useEffect(() => {
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
    setRequestId((prev) => prev + 1);
  }

  return { image, status, error, retry };
}
