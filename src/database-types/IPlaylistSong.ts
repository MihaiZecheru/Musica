import { SongID } from "./ID";

export default interface IPlaylistSong {
  songID: SongID;
  position: number; // starting from 1
  dateAdded: number;
}