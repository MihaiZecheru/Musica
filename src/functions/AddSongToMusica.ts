import { SongID, VideoID } from "../database-types/ID";
import AddSongToDatabase from "./AddSongToDatabase";
import { SpotifyAPISong } from "./spotifyService";
import { YoutubeAPIVideo, searchYoutubeForMatchingVideo } from "./youtubeService";

function convertDurationToSeconds(duration: string): number {
  const [minutes, seconds] = duration.split(':').map(Number);
  return minutes * 60 + seconds;
}

function getID(url: string): VideoID {
  return url.split('=')[1] as VideoID;
}

export default async function AddSongToMusica(song: SpotifyAPISong): Promise<SongID> {
  const video: YoutubeAPIVideo = await searchYoutubeForMatchingVideo(song.name, song.artists[0].name);
  
  if (!video) {
    console.error(`Could not find a video for ${song.name} by ${song.artists[0].name}`);
    throw new Error(`Could not find a video for ${song.name} by ${song.artists[0].name}`);
  }

  return await AddSongToDatabase(
    getID(video.url),                                                    // videoID
    song.name,                                                    // title
    song.artists.map((s: { name: string }) => s.name).join(', '), // artists
    parseInt(song.album.release_date.substring(0, 4)),            // year
    convertDurationToSeconds(video.duration),                     // duration
    song.album.images[1].url,                                     // imageURL
    song.id                                                       // spotifySongID
  );
}
