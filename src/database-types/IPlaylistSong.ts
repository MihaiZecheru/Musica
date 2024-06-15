import { SongID } from "./ID";

export default interface IPlaylistSong {
  song_id: SongID; // 6 chars (alphanum hex)
  position: number; // starting from 1
  date_added: number; // Date.now timestamp
}