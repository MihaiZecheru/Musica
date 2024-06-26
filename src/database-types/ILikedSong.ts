import { SongID, UserID } from "./ID";

export type TLikedSongData = {
  songID: SongID;
  dateAdded: number;
}

export default interface ILikedSong {
  userID: UserID;
  songs: Array<TLikedSongData>;
}