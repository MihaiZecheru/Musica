import { SongID, SpotifySongID, VideoID } from "./ID";

export default interface ISong {
  id: SongID;
  videoID: VideoID;
  title: string;
  artists: string;
  year: number; // 4-digit year
  duration: number; // in seconds
  imageURL: string;
  spotifySongID: SpotifySongID;
}