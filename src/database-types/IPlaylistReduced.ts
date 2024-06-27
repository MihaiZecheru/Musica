import { PlaylistID, UserID } from "./ID";
import IPlaylistSong from "./IPlaylistSong";

export default interface IPlaylistReduced {
  id: PlaylistID;
  title: string;
  songs: IPlaylistSong[];
}