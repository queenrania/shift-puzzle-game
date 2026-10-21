import { IMAGE_SIZE } from "../config.js";

const PICSUM_BASE = "https://picsum.photos";

// This waits for the image to load so the game never starts with a half-loaded picture.
function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => reject(new Error("The image failed to download."));
    img.src = src;
  });
}

// The one place the game asks "which picture should I use?" After this project, will switch out for my own images.
export async function getPuzzleImage(size = IMAGE_SIZE) {
  const page = Math.floor(Math.random() * 10) + 1;
  const response = await fetch(`${PICSUM_BASE}/v2/list?page=${page}&limit=30`);

  if (!response.ok) {
    throw new Error(`Image list request failed (status ${response.status}).`);
  }

  const photos = await response.json();

  if (!Array.isArray(photos) || photos.length === 0) {
    throw new Error("The image service returned no pictures.");
  }

  const photo = photos[Math.floor(Math.random() * photos.length)];
  const url = `${PICSUM_BASE}/id/${photo.id}/${size}/${size}`;

  await preloadImage(url);

  return {
    url,
    author: photo.author,
    sourceUrl: photo.url,
  };
}
