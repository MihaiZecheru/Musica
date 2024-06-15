import { SongID } from "./ID";

export default interface ISong {
  id: SongID; // 6 chars (alphanum hex)
  title: string; // 50 chars max
  artist: string; // 50 chars max
  year: number; // 4-digit year
  duration: number; // in seconds
  imageURL: string; // TEXT
}