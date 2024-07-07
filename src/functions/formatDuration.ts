export default function formatDuration(duration: number): string {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
}