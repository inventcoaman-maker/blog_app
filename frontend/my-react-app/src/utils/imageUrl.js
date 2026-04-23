export function resolveImageUrl(imagePath) {
  if (!imagePath) return "";

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/g, "") || "";
  if (!baseUrl) {
    return imagePath;
  }

  // Ensure imagePath starts with /media/
  if (imagePath.startsWith("media/")) {
    imagePath = `/${imagePath}`;
  } else if (!imagePath.startsWith("/media/")) {
    imagePath = `/media/${imagePath.startsWith("/") ? imagePath.slice(1) : imagePath}`;
  }

  return `${baseUrl}${imagePath}`;
}
