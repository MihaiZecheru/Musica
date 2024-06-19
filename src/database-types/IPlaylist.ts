import { PlaylistID, UserID } from "./ID";
import IPlaylistSong from "./IPlaylistSong";

export default interface IPlaylist {
  id: PlaylistID;
  creatorID: UserID;
  createdAt: number; // Date.now timestamp
  isPublic: boolean;
  title: string;
  description: string;
  imageURL: string;
  songs: Array<IPlaylistSong>;
}