export function resolveImageUrl(imagePath) {
  if (!imagePath) return "";

  // already full URL
  if (imagePath.startsWith("http")) return imagePath;

  const baseUrl = import.meta.env.VITE_API_URL;

  return `${baseUrl}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
}
