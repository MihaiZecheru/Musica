import { PlaylistID } from "./ID";
import IPlaylistSong from "./IPlaylistSong";

export default interface IPlaylist {
  id: PlaylistID;
  creatorID: string; // 6 chars (alphanum hex)
  createdAt: number; // Date.now timestamp
  isPublic: boolean;
  title: string; // 100 chars max
  description: string; // 500 chars max
  imageURL: string; // TEXT
  songData: Array<IPlaylistSong>;
}