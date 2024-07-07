export default function PlayAudio(audioURL: string): void {
  const audio = new Audio(audioURL);
  audio.play();
}