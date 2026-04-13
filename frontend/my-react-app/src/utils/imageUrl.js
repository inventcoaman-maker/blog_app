export function resolveImageUrl(imagePath) {
  if (!imagePath) return "";

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/g, "") || "";
  if (!baseUrl) {
    return imagePath;
  }

  return imagePath.startsWith("/")
    ? `${baseUrl}${imagePath}`
    : `${baseUrl}/${imagePath}`;
}
