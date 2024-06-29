import { useEffect, useState } from "react";
import IPlaylist from "../database-types/IPlaylist";
import SideNav from "./SideNav";
import ISong from "../database-types/ISong";
import supabase from "../config/supabase";
import GetUser from "../functions/GetUser";
import { PlaylistID, SongID, UserID } from "../database-types/ID";
import Loading from "./Loading";
import { TLikedSongData } from "../database-types/ILikedSong";

const Home = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [userID, setUserID] = useState<string | null>(null);
  const [likedSongs, setLikedSongs] = useState<TLikedSongData[]>([]);
  const [playlistLibrary, setPlaylistLibrary] = useState<PlaylistID[]>([]);
  const [playlists, setPlaylists] = useState<IPlaylist[]>([]);
  const [queueSongIDs, setQueueSongIDs] = useState<SongID[]>([]);
  const [queue, setQueue] = useState<ISong[]>([]);
  const loadingStart = Date.now();

  useEffect(() => {
    (async () => {
      const _userID: UserID = (await GetUser()).id as UserID;
      setUserID(_userID);

      const { data: data_UserMusicLibrary, error: error_UserMusicLibrary } = await supabase
        .from("UserMusicLibrary")
        .select()
        .eq("userID", _userID);

      if (error_UserMusicLibrary) {
        console.error("error fetching UserMusicLibrary: ", data_UserMusicLibrary);
        throw error_UserMusicLibrary;
      }

      const userMusicLibrary = data_UserMusicLibrary![0] as { likedSongs: TLikedSongData[], songQueue: SongID[], playlistLibrary: PlaylistID[] };
      setLikedSongs(userMusicLibrary.likedSongs);
      setQueueSongIDs(userMusicLibrary.songQueue);
      setPlaylistLibrary(userMusicLibrary.playlistLibrary);

      const { data: data_playlists, error: error_playlists } = await supabase
        .from("Playlists")
        .select()
        .in('id', userMusicLibrary.playlistLibrary);
      
      if (error_playlists) {
        console.error("error fetching playlists in library: ", error_playlists);
        throw error_playlists;
      }
        
      setPlaylists(data_playlists);

      const { data: data_queue, error: error_queue } = await supabase
        .from("Songs")
        .select()
        .in('id', userMusicLibrary.songQueue);

      if (error_queue) {
        console.error("error fetching queue: ", error_queue);
        throw error_queue;
      }

      setQueue(data_queue);

      // check if at least 1000ms have passed since loadingStart
      if (loadingStart + 1000 < Date.now()) {
        setLoading(false);
      } else {
        setTimeout(() => {
          setLoading(false);
        }, 1000 - (Date.now() - loadingStart));
      }
    })();
  }, []);

  if (loading) {
    return (
      <Loading />
    );
  }


  return (
    <>
      <SideNav queue={ queue } playlists={ playlists } />
    </>
  );
}
 
export default Home;