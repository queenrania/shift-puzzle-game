import { useEffect, useRef } from "react";

// A larger view of the finished picture, shown in a native <dialog>.
// The browser handles focus, the Escape key, and the dimmed backdrop.
export default function ImagePreview({ imageUrl, open, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Clicking the dark area outside the picture closes it.
  function handleClick(event) {
    if (event.target === dialogRef.current) onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      className="image-preview"
      onClose={onClose}
      onClick={handleClick}
      aria-label="Finished picture"
    >
      <img src={imageUrl} alt="The finished puzzle picture" />
      <button type="button" className="image-preview-close" onClick={onClose}>
        Close
      </button>
    </dialog>
  );
}
