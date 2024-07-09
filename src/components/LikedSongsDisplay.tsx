import { useEffect, useState } from "react";
import { SongID } from "../database-types/ID";
import supabase from "../config/supabase";
import ISong from "../database-types/ISong";
import { TLikedSongData } from "../database-types/ILikedSong";
import likedSongsPlaylistIcon from "../liked-songs-playlist.png";
import PlaylistSong from "./PlaylistSong";

interface Props {
  likedSongs: TLikedSongData[];
  onClickPlaySong: Function;
  removeFromLikedSongs: Function;
  addToLikedSongs: Function;
}

const LikedSongsDisplay = ({ likedSongs, onClickPlaySong, removeFromLikedSongs, addToLikedSongs }: Props) => {
  const [songs, setSongs] = useState<ISong[]>([]);

  useEffect(() => {
    (async () => {
      likedSongs.sort((a: TLikedSongData, b: TLikedSongData) => a.dateAdded - b.dateAdded);
      const songIDs: SongID[] = likedSongs.map((song: TLikedSongData) => song.songID);
      
      const { data: songs, error } = await supabase
        .from("Songs")
        .select()
        .in('id', songIDs);

      if (error) {
        console.error('error fetching songs from likedSongs: ', error);
        throw error;
      }

      setSongs(songs);
    })();
  }, [likedSongs]);

  return (
    <>
      <div className="d-flex align-items-center justify-content-center pt-3">
        <img src={ likedSongsPlaylistIcon } alt="Liked Songs Playlist" height="200px" className="me-3" />
        <div>
          <h1 className="musica-dark-pink">Liked Songs</h1>
          <h5 className="white-color no-drag">{ songs.length } songs</h5>
        </div>
      </div>
      <div className="d-flex justify-content-between mt-4 ms-4 me-4">
        <div style={{ "width": "calc(21rem + 60px)" }} className="d-flex align-items-center">
          <h5 className="musica-dark-blue no-drag" style={{ "marginRight": "1rem" }}>#</h5>
          <h5 className="musica-dark-blue no-drag">Song</h5>
        </div>
        <h5 className="musica-dark-blue no-drag">Date Added</h5>
        <h5 className="musica-dark-blue no-drag"><i className="far fa-clock"></i></h5>
      </div>
      <div className="d-flex justify-content-center">
        <hr className="w-100 ms-4 me-4 mt-0" />
      </div>
      <div className="ms-2 songs-container">
        {
          songs.map((song: ISong, index: number) =>
            <PlaylistSong
              key={ song.id }
              song={ song }
              position={ index }
              onClickPlaySong={ onClickPlaySong }
              dateAdded={ likedSongs.find((likedSong: TLikedSongData) => likedSong.songID === song.id)?.dateAdded! }
              songIsLiked={ (songID: SongID) => likedSongs.some((likedSong: TLikedSongData) => likedSong.songID === songID) }
              removeFromLikedSongs={ removeFromLikedSongs }
              addToLikedSongs={ addToLikedSongs }
            />
          )
        }
      </div>
    </>
  );
}
 
export default LikedSongsDisplay;