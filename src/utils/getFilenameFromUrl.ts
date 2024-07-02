export function getFilenameFromUrl(url: string): string {
  const match = url.match(/\/([^/]+)$/);
  return match ? match[1] : "";
}
