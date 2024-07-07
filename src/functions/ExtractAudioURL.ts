import { VideoID } from "../database-types/ID";

export default async function ExtractAudioURL(videoID: VideoID): Promise<string> {
  return await fetch('', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ videoID })
  }).then(res => res.json())
}
