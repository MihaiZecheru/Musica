import { useEffect, useState } from "react";
import IPlaylist from "../database-types/IPlaylist";
import SideNav from "./SideNav";
import ISong from "../database-types/ISong";
import supabase from "../config/supabase";
import GetUser from "../functions/GetUser";
import { PlaylistID, SongID, UserID } from "../database-types/ID";
import Loading from "./Loading";
import { TLikedSongData } from "../database-types/ILikedSong";
import LikedSongsDisplay from "./LikedSongsDisplay";
import PlaylistDisplay from "./PlaylistDisplay";

const Home = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [likedSongs, setLikedSongs] = useState<TLikedSongData[]>([]);
  const [playlists, setPlaylists] = useState<IPlaylist[]>([]);
  const [queue, setQueue] = useState<ISong[]>([]);
  const [activePlaylist, setActivePlaylist] = useState<IPlaylist | null>(null);
  const loadingStart = Date.now();

  useEffect(() => {
    (async () => {
      const userID: UserID = (await GetUser()).id as UserID;

      const { data: data_UserMusicLibrary, error: error_UserMusicLibrary } = await supabase
        .from("UserMusicLibrary")
        .select()
        .eq("userID", userID);

      if (error_UserMusicLibrary) {
        console.error("error fetching UserMusicLibrary: ", error_UserMusicLibrary);
        throw error_UserMusicLibrary;
      }

      const userMusicLibrary = data_UserMusicLibrary![0] as { likedSongs: TLikedSongData[], songQueue: SongID[], playlistLibrary: PlaylistID[] };
      setLikedSongs(userMusicLibrary.likedSongs);

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
      <SideNav queue={ queue } playlists={ playlists } setActivePlaylist={ setActivePlaylist }/>
      <main id="home-main">
        {
          activePlaylist
          ? <PlaylistDisplay playlist={ activePlaylist } />
          : <LikedSongsDisplay likedSongs={ likedSongs } />
        }
      </main>
    </>
  );
}
 
export default Home;