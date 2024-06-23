import { SongID } from "./ID";

export default interface ISong {
  id: SongID;
  videoURL: string;
  title: string;
  artists: string;
  year: number; // 4-digit year
  duration: number; // in seconds
  imageURL: string;
}