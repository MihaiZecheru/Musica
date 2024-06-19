import { SongID } from "./ID";

export default interface ISong {
  id: SongID;
  videoURL: string;
  title: string;
  artist: string;
  year: number; // 4-digit year
  duration: number; // in seconds
  imageURL: string;
}