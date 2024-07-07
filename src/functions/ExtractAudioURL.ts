import { VideoID } from "../database-types/ID";

export default async function ExtractAudioURL(videoID: VideoID): Promise<string> {
  return await fetch('https://us-west2-musica-381004.cloudfunctions.net/ExtractAudioURL', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ videoID }),
  }).then(res => res.text());
}
